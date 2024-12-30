import { Context } from "hono";

import { B2BWebhookResponse, BankPayload, DataArgs, NonceArgs } from "@repo/schema/types";
import { decryptData } from "@repo/common/decryption";

import { prisma } from "./db";
import { Env } from "../api-env";
import { MAX_NONCE_AGE } from "../utils/constant";
import { cacheType, honoCache } from "@repo/db/cache";

/**
 * Processes the bank transaction and send the external link to the user
 * @param c `Context`
 * @param body `BankPayload`
 * @returns `{success: boolean, message: string, paymentToken: string | null}`
 */

export const processTransaction = async (
  c: Context,
  body: BankPayload
): Promise<B2BWebhookResponse> => {
  const webhookAttempt = c.req.header("x-webhook-attempt");
  const timestamp = c.req.header("x-timestamp");
  const idempotencyKey = c.req.header("x-idempotency-key");

  const { payload, nonce } = body;
  const { encryptData, body: b2bBody } = payload;
  const { amount, webhookId } = b2bBody;
  const env: Env = c.env;
  const db = prisma(env);
  const cache = honoCache.getInstance(env.UPSTASH_REDIS_REST_URL, env.UPSTASH_REDIS_REST_TOKEN);

  // Check if the nonce is expired
  const currentTime = Date.now();
  if (currentTime - Number(timestamp) > MAX_NONCE_AGE * 1000) {
    return { success: false, message: "Nonce expired", paymentToken: null };
  }

  try {
    // Check for reused nonce
    const existingNounce = await cache.get(cacheType.NONCE, [nonce]);
    if (existingNounce) {
      return {
        success: false,
        message: "Replay attack detected: Nonce already used",
        paymentToken: null,
      };
    }

    // decrypt data
    const decryptedData: DataArgs = await decryptData(encryptData, env.WEBHOOK_BANK_SECRET);

    // Cache the nonce
    const nounceCache: NonceArgs = {
      nonce: nonce,
      txnId: decryptedData.txnId!,
      IdepotencyKey: idempotencyKey!,
    };
    await cache.set(cacheType.NONCE, [nonce], nounceCache, MAX_NONCE_AGE);

    if (!decryptedData.txnId) {
      return { success: false, message: "Transaction ID not found", paymentToken: null };
    }

    // fetch transaction data
    const transaction = await db.b2bTransaction.findUnique({
      where: {
        id: decryptedData.txnId,
        //webhookId: webhookId!
      },
      select: {
        id: true,
        senderUserId: true,
        receiverUserId: true,
        senderBankName: true,
        amount: true,
        status: true,
        webhookStatus: true,
      },
    });

    if (
      !transaction ||
      transaction.senderUserId !== decryptedData.senderId ||
      transaction.receiverUserId !== decryptedData.receiverId ||
      transaction.amount !== amount
    ) {
      return { success: false, message: "Transaction not found", paymentToken: null };
    }

    if (transaction.status !== "PROCESSING" || transaction.webhookStatus !== "PENDING") {
      return { success: true, message: "Transaction processed already", paymentToken: null };
    }

    // validate amount
    const bank = await db.bankAccount.findUnique({
      where: { userId: decryptedData.senderId },
      select: { balance: true },
    });

    if (!bank) {
      return { success: false, message: "Bank account not found", paymentToken: null };
    }

    if (bank.balance < amount) {
      return { success: false, message: "Insufficient balance", paymentToken: null };
    }

    // update transaction / webhook status / webhook attempts
    await db.b2bTransaction.update({
      where: { id: transaction.id },
      data: {
        status: "PROCESSING",
        webhookStatus: "COMPLETED",
        webhookAttempts: webhookAttempt ? Number(webhookAttempt) : 0,
        lastWebhookAttempt: timestamp ? new Date(Number(timestamp)) : null,
      },
    });

    // external link: txn id + nounce id
    // ex: https://bank.rupeerush.com/bank/HDFC?txnId=1234567890&nonce=1234567890
    const paymentToken = `/bank/${transaction.senderBankName}?txnId=${transaction.id}&nonce=${nonce}`;

    return { success: true, message: "Transaction processed", paymentToken };
  } catch (err: any) {
    console.error("> Error while processing Bank API:", err);
    return { success: false, message: err.message || "Internal Server Error", paymentToken: null };
  }
};
