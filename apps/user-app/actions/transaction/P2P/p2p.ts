"use server";

import { compare } from "bcryptjs";

import { auth } from "@/lib/auth";
import { cache, cacheType } from "@repo/db/cache";
import db, { SchemaTypes } from "@repo/db/client";
import { WALLET_LOCK_DURATION, WALLET_PIN_ATTEMPTS_LIMIT } from "@/utils/constant";
import { encryptData } from "@/utils/data";
import { callWebhook } from "@/lib/api";
import {
  checkWalletBalance,
  createP2PTransaction,
  prepareWebhookPayload,
  processTransactionWebhook,
  validateReceiver,
  verifyWalletPin,
} from "@/lib/transaction";

interface CreateP2PTxnProps {
  receiverIdentifier: string;
  amount: number;
  userId: string;
  pin: string;
  transferMethod: SchemaTypes.TransferMethod;
  ipAddress?: string;
  userAgent?: string;
}

// TODO: seperate logic of checking recipient and directly do that in first form from p2pCard
export const createP2PTxnAction = async ({ ...props }: CreateP2PTxnProps) => {
  const { userId, amount, transferMethod, receiverIdentifier, pin, ipAddress, userAgent } = props;

  const session = await auth();
  if (!session || session?.user?.id !== props.userId) {
    throw new Error("Unauthrized!");
  }

  try {
    const result = await db.$transaction(async (txn) => {
      const receiver = await validateReceiver({ txn, receiverIdentifier, transferMethod });
      if (!receiver.success) {
        throw new Error(receiver.message);
      }
      if (receiver.receiverId === props.userId) {
        throw new Error("You can't send money to yourself!");
      }

      const pinValid = await verifyWalletPin(pin, userId);
      if (!pinValid.success) {
        throw new Error(pinValid.message);
      }

      const walletBalance = await checkWalletBalance(userId);

      if (!walletBalance.success) {
        throw new Error(walletBalance.message);
      }
      if (walletBalance.balance < amount) {
        throw new Error("Insufficient balance");
      }

      // transaction with webhook tracking
      const tx = await createP2PTransaction({
        txn,
        ...props,
        receiverId: receiver.receiverId!,
        userUPI: pinValid.upiId!,
      });

      // TODO: we are sending pin, i think we should be verifying pin on webhook
      // Prepare webhook payload with encrypted sensitive data
      const webhookPayload = await prepareWebhookPayload({
        transaction: tx,
        props,
        receiverId: receiver.receiverId!,
      });

      return {
        success: true,
        transactionId: tx.id,
        payload: webhookPayload,
        balance: tx.wallet.balance,
      };
    });

    // Calling webhook API
    await processTransactionWebhook(result.transactionId, result.payload, userId, amount);

    // const response: WebhookResponse = await callWebhook(result.payload);
    // if (!response.success) {
    //   await db.$transaction(async (txn) => {
    //     await txn.p2pTransaction.update({
    //       where: { id: result.transactionId },
    //       data: { status: "FAILURE", webhookStatus: "FAILED" },
    //     });

    //   });

    //   throw new Error(`Transaction failed: ${response.message}`);
    // } else {
    //   await db.p2pTransaction.update({
    //     where: { id: result.transactionId },
    //     data: { status: "SUCCESS", webhookStatus: "COMPLETED" },
    //   });
    // }

    return { success: true, res: { balance: result.balance, transactionId: result.transactionId } };

    // Compensating transaction: (handle failure)
  } catch (err: any) {
    console.error("> Error while creating P2P transaction:", err);
    return { error: err.message };

    // disconnect from db
  } finally {
    await db.$disconnect();
  }
};
