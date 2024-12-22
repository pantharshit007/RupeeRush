import { Context } from "hono";
import { compare } from "bcryptjs";

import { IdepotencyCache, NonceArgs, PaymentPayload } from "@repo/schema/types";
import { cacheType, honoCache } from "@repo/db/cache";

import { Env } from "../api-env";
import { prisma } from "../lib/db";
import { CustomError } from "../utils/error";
import { PaymentViaCardSchema } from "../utils/zod";

async function processPaymentController(c: Context) {
  const env: Env = c.env;
  const db = prisma(env);
  const cache = honoCache.getInstance(env.UPSTASH_REDIS_REST_URL, env.UPSTASH_REDIS_REST_TOKEN);

  try {
    // data from body
    const body: PaymentPayload = await c.req.json();
    const { success, error } = PaymentViaCardSchema.safeParse(body);

    if (!success) {
      return c.json({
        success: false,
        message: error.errors[0].message,
      });
    }

    const { cardNumber, expiry, cvv, cardholderName, pin, txnId, nonce } = body;

    // validate nonce from cache
    const cachedNonce: NonceArgs = await cache.get(cacheType.NONCE, [nonce]);
    if (!cachedNonce) {
      return c.json({
        success: false,
        message: "Nonce Expired! Retry Payment",
      });
    }

    if (cachedNonce.txnId !== txnId) {
      return c.json({
        success: false,
        message: "Transaction Id Mismatch! Retry Payment",
      });
    }

    const transactionInfo = await db.b2bTransaction.findUnique({
      where: { id: txnId },
      select: { senderUserId: true, receiverUserId: true, status: true, amount: true },
    });

    if (!transactionInfo || !transactionInfo.senderUserId || !transactionInfo.receiverUserId) {
      return c.json({
        success: false,
        message: "Transaction Not Found! Retry Payment",
      });
    }

    if (transactionInfo?.status === "SUCCESS" || transactionInfo?.status === "FAILURE") {
      return c.json({
        success: true,
        message: "Transaction Already Processed!",
      });
    }

    // update database and perform txn
    await db.$transaction(async (txn) => {
      // Lock the sender row for update to prevent parallel transactions
      const senderBalance =
        await txn.$queryRaw`SELECT * FROM "BankAccount" WHERE "userId" = ${transactionInfo.senderUserId} FOR UPDATE`;

      // @ts-expect-error: Object is possibly 'undefined'.
      if (!senderBalance || senderBalance[0].balance < transactionInfo.amount) {
        throw new CustomError("Insufficient balance", 422);
      }

      const userData = await txn.bankAccount.findUnique({
        where: { userId: transactionInfo.senderUserId! },
        select: {
          cardHolder: true,
          cardNumber: true,
          cardPinHash: true,
          cardCvv: true,
          cardExpiry: true,
        },
      });

      if (!userData) {
        throw new CustomError("User not found", 404);
      }

      if (
        userData.cardHolder !== cardholderName ||
        userData.cardNumber !== cardNumber ||
        userData.cardCvv !== cvv ||
        userData.cardExpiry !== expiry ||
        (await compare(userData.cardPinHash, pin))
      ) {
        throw new CustomError("Invalid card details", 401);
      }

      // Deduct amount from sender
      await txn.bankAccount.update({
        where: { userId: transactionInfo.senderUserId! },
        data: { balance: { decrement: transactionInfo.amount } },
      });

      // Credit amount to receiver
      await txn.bankAccount.update({
        where: { userId: transactionInfo.receiverUserId! },
        data: { balance: { increment: transactionInfo.amount } },
      });

      // Update transaction
      await txn.b2bTransaction.update({
        where: { id: txnId },
        data: {
          status: "SUCCESS",
        },
      });
    });

    // update cache: idempotencyKey
    const idempotencyCache: IdepotencyCache = {
      lastUpdated: new Date().toISOString(),
      processedAt: new Date().toISOString(),
      status: "PROCESSED",
    };

    await cache.set(cacheType.IDEMPOTENCY_KEY, [cachedNonce.IdepotencyKey], idempotencyCache, 1200); // cache for 20 minutes

    await cache.evict(cacheType.BANK_BALANCE, [transactionInfo.senderUserId]);
    await cache.evict(cacheType.BANK_BALANCE, [transactionInfo.receiverUserId]);
    await cache.evict(cacheType.B2B_TRANSACTION, [transactionInfo.senderUserId]);
    await cache.evict(cacheType.B2B_TRANSACTION, [transactionInfo.receiverUserId]);

    // return success : bank FE and user FE
    return c.json({
      success: true,
      message: "Payment Successful!",
    });
  } catch (err: any) {
    console.log("> Error in processing Payment: ", err);
    return c.json({
      success: false,
      message: "Payment Failed: " + err.message,
    });
  }
}

export { processPaymentController };
