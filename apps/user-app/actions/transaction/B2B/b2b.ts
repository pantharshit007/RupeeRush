"use server";

import { auth } from "@/lib/auth";
import {
  createB2BTransaction,
  prepareWebhookPayload,
  processTransactionWebhook,
  validateAccountNumber,
} from "@/lib/b2bTransaction";
import { cache, cacheType } from "@repo/db/cache";
import db from "@repo/db/client";

export interface CreateB2BTxnActionProps {
  receiverAccountNumber: string;
  amount: number;
  senderId: string;
}

export const createB2BTxnAction = async ({ ...props }: CreateB2BTxnActionProps) => {
  const { receiverAccountNumber, amount, senderId } = props;

  const session = await auth();
  if (!session || session?.user?.id !== senderId) {
    throw new Error("Unauthrized!");
  }

  try {
    const result = await db.$transaction(async (txn) => {
      const receiverAccount = await validateAccountNumber(receiverAccountNumber);
      if (!receiverAccount.success) {
        throw new Error(receiverAccount.message);
      }

      const senderAccount = await txn.bankAccount.findUnique({
        where: { userId: senderId },
        select: { accountNumber: true, bankName: true },
      });

      if (!senderAccount) {
        throw new Error("Sender account not found");
      }

      // create transaction
      const transaction = await createB2BTransaction({
        txn,
        ...props,
        senderAccountNumber: senderAccount.accountNumber,
        senderBank: senderAccount.bankName,
        receiverId: receiverAccount.receiver?.userId!,
        receiverBank: receiverAccount.receiver?.bankName!,
      });

      // prepare webhook payload
      const webhookPayload = await prepareWebhookPayload({
        transaction,
        props,
        receiverId: receiverAccount.receiver?.userId!,
      });

      return {
        transactionId: transaction.id,
        payload: webhookPayload,
      };
    });

    // calling webhook API
    const response = await processTransactionWebhook(result.transactionId, result.payload);

    if (!response.success) {
      throw new Error(response.message);
    }

    return {
      success: true,
      paymentToken: response.paymentToken,
    };
  } catch (err: any) {
    console.error("> Error while creating B2B transaction:", err.message);
    return { error: err.message };
  } finally {
    await cache.evict(cacheType.B2B_TRANSACTION, [senderId]);
  }
};
