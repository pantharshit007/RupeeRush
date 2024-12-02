import { P2PWebhookPayload } from "@repo/schema/types";
import { decryptData } from "./decryption";
import db from "@repo/db/client";
import { cache, cacheType } from "@repo/db/cache";
import { CustomError } from "../utils/error";

const WEBHOOK_SECRET = process.env.WEBHOOK_SECRET ?? "superSecret";

interface DecryptedData {
  pin: string;
  senderId: string;
  receiverId: string;
}

export const processP2PTransaction = async (
  body: P2PWebhookPayload,
  idempotencyKey: string,
  signal: AbortSignal
) => {
  if (signal.aborted) {
    return { success: false, code: 408, message: "Request timed out" };
  }

  try {
    const { encryptData, body: txnBody } = body;
    const { amount, webhookId } = txnBody;

    const checkAbortSignal = () => {
      if (signal.aborted) {
        throw new Error("Request timed out");
      }
    };

    const decryptedData: DecryptedData = decryptData(encryptData, WEBHOOK_SECRET);

    // Check if sender has enough balance: just in case another transaction is processed during last check
    checkAbortSignal();
    let walletBalance = await cache.get(cacheType.WALLET_BALANCE, [decryptedData.senderId]);
    if (!walletBalance) {
      checkAbortSignal();
      const balance = await db.walletBalance.findUnique({
        where: { userId: decryptedData.senderId },
        select: { balance: true },
      });

      await cache.set(cacheType.WALLET_BALANCE, [decryptedData.senderId], balance?.balance);
      walletBalance = balance?.balance;
    }

    checkAbortSignal();
    if (walletBalance < amount) {
      return { success: false, code: 422, message: "Insufficient balance" };
    }

    const result = await db.$transaction(async (txn) => {
      checkAbortSignal();

      // deduct amount from sender
      await txn.walletBalance.update({
        where: { userId: decryptedData.senderId },
        data: { balance: { decrement: amount } },
      });

      checkAbortSignal();
      // credit amount to receiver
      await txn.walletBalance.update({
        where: { userId: decryptedData.receiverId },
        data: { balance: { increment: amount } },
      });

      checkAbortSignal();
      // update transaction
      const isProcessed = await txn.p2pTransaction.findUnique({
        where: { webhookId: webhookId },
        select: { webhookStatus: true, status: true },
      });

      if (!isProcessed) {
        throw new CustomError("Transaction not found", 404);
      }

      if (
        isProcessed.webhookStatus === "COMPLETED" ||
        isProcessed.webhookStatus === "FAILED" ||
        isProcessed.status === "FAILURE" ||
        isProcessed.status === "SUCCESS"
      ) {
        throw new CustomError("Transaction already processed", 409);
      }

      const txnData = await txn.p2pTransaction.update({
        where: { webhookId: webhookId },
        data: {
          status: "SUCCESS",
          webhookStatus: "COMPLETED",
          lastWebhookAttempt: new Date(),
        },
      });
      checkAbortSignal();

      return { ...txnData };
    });

    checkAbortSignal();
    const cacheData = { ...result, processedAt: new Date().toISOString() };
    await cache.set(cacheType.IDEMPOTENCY_KEY, [idempotencyKey], cacheData, 1200); // cache for 20 minutes
    await cache.evict(cacheType.WALLET_BALANCE, [decryptedData.senderId]);
    await cache.evict(cacheType.WALLET_BALANCE, [decryptedData.receiverId]);

    return { success: true, message: "Transaction processed" };
  } catch (err: any) {
    console.error("> Error while processing transaction:", err.message);
    if (err instanceof CustomError) {
      return { success: false, code: err.statusCode, message: err.message };
    } else {
      return { success: false, code: 500, message: err.message };
    }
  }
};
