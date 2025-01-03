import db, { SchemaTypes } from "@repo/db/client";
import { DataArgs, IdepotencyCache, P2PWebhookPayload } from "@repo/schema/types";
import { decryptData } from "@repo/common/decryption";
import { cache, cacheType } from "@repo/db/cache";
import { CustomError } from "../utils/error";

const WEBHOOK_SECRET = process.env.WEBHOOK_SECRET ?? "superSecret";

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

    const decryptedData: DataArgs = await decryptData(encryptData, WEBHOOK_SECRET);

    const result = await db.$transaction(async (txn) => {
      checkAbortSignal();

      // Lock the sender row for update to prevent parallel transactions
      const senderBalance: SchemaTypes.WalletBalance[] =
        await txn.$queryRaw`SELECT * FROM "WalletBalance" WHERE "userId" = ${decryptedData.senderId} FOR UPDATE`;

      // @ts-expect-error: Object is possibly 'undefined'.
      if (!senderBalance || senderBalance[0].balance < amount) {
        throw new CustomError("Insufficient balance", 422);
      }

      checkAbortSignal();

      // Deduct amount from sender
      await txn.walletBalance.update({
        where: { userId: decryptedData.senderId },
        data: { balance: { decrement: amount } },
      });

      checkAbortSignal();

      // Credit amount to receiver
      await txn.walletBalance.update({
        where: { userId: decryptedData.receiverId },
        data: { balance: { increment: amount } },
      });

      checkAbortSignal();

      // Update transaction
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

      return { ...txnData };
    });

    checkAbortSignal();

    const cacheData: IdepotencyCache = {
      ...result,
      processedAt: new Date().toISOString(),
      lastUpdated: new Date().toISOString(),
      status: "PROCESSED",
    };
    await cache.set(cacheType.IDEMPOTENCY_KEY, [idempotencyKey], cacheData, 1200); // cache for 20 minutes
    await cache.evict(cacheType.WALLET_BALANCE, [decryptedData.senderId]);
    await cache.evict(cacheType.WALLET_BALANCE, [decryptedData.receiverId]);
    await cache.evict(cacheType.TRANSACTION_PAGE, [decryptedData.senderId, "page", "1"]); // clearing cache for transaction page
    await cache.evict(cacheType.TRANSACTION_PAGE, [decryptedData.receiverId, "page", "1"]); // clearing cache for transaction page

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
