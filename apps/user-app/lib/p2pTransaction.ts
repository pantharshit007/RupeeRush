import { compare } from "bcryptjs";

import db, { SchemaTypes } from "@repo/db/client";
import { cache, cacheType } from "@repo/db/cache";
import { cachedWalletBalance, P2PWebhookPayload, P2PWebhookResponse } from "@repo/schema/types";

import { encryptData } from "@repo/common/encryption";
import { ACCOUNT_LOCK_DURATION, WALLET_PIN_ATTEMPTS_LIMIT } from "@/utils/constant";
import { callP2PWebhook } from "@/lib/api";

const WEBHOOK_SECRET = process.env.WEBHOOK_SECRET ?? "superSecret";

interface transaction {
  txn: Omit<
    // @ts-ignore
    SchemaTypes.PrismaClient<SchemaTypes.Prisma.PrismaClientOptions, never, DefaultArgs>,
    "$connect" | "$disconnect" | "$on" | "$transaction" | "$use" | "$extends"
  >;
}

interface ValidateReceiverProps extends transaction {
  txn: transaction["txn"];
  receiverIdentifier: string;
  transferMethod: string;
}

interface CreateP2PTxnProps extends transaction {
  txn: transaction["txn"];
  receiverId: string;
  receiverIdentifier: string;
  amount: number;
  userId: string;
  pin: string;
  userUPI: string;
  transferMethod: SchemaTypes.TransferMethod;
  ipAddress?: string;
  userAgent?: string;
}

interface webhookPayloadProps {
  transaction: any;
  receiverId: string;
  props: {
    receiverIdentifier: string;
    amount: number;
    userId: string;
    pin: string;
    transferMethod: SchemaTypes.TransferMethod;
    ipAddress?: string;
    userAgent?: string;
  };
}

export const validateReceiver = async ({
  txn,
  receiverIdentifier,
  transferMethod,
}: ValidateReceiverProps) => {
  const receiver = await txn.user.findUnique({
    where:
      transferMethod === "UPI"
        ? { upiId: receiverIdentifier }
        : { phoneNumber: receiverIdentifier },
    select: { id: true },
  });

  if (!receiver) {
    return { success: false, message: "Receiver not found" };
  }

  return { success: true, receiverId: receiver.id };
};

export const verifyWalletPin = async (pin: string, userId: string) => {
  try {
    const userData = await db.user.findUnique({
      where: { id: userId },
      select: {
        upiId: true,
        walletPin: true,
        walletPinAttempts: true,
        walletLockUntil: true,
      },
    });

    if (!userData || !userData.walletPin) {
      return { success: false, message: "No Pin configured" };
    }

    // Check if wallet is locked
    if (userData.walletLockUntil && userData.walletLockUntil > new Date()) {
      return {
        success: false,
        message: "Wallet locked. Try again after: " + userData.walletLockUntil.toLocaleString(),
      };
    }

    const isValid = await compare(pin, userData.walletPin);

    if (!isValid) {
      const attempts = userData.walletPinAttempts + 1;
      const updates: any = { walletPinAttempts: attempts };

      if (attempts >= WALLET_PIN_ATTEMPTS_LIMIT) {
        updates.walletLockUntil = new Date(Date.now() + ACCOUNT_LOCK_DURATION);
        updates.walletPinAttempts = 0;
      }

      await db.user.update({
        where: { id: userId },
        data: updates,
      });

      return {
        success: false,
        message: `Invalid PIN. ${WALLET_PIN_ATTEMPTS_LIMIT - attempts} attempts remaining`,
      };
    }

    if (userData.walletPinAttempts > 0) {
      await db.user.update({
        where: { id: userId },
        data: { walletPinAttempts: 0, walletLockUntil: null },
      });
    }

    return { success: true, message: "Pin Verified", upiId: userData.upiId };
  } catch (err: any) {
    return { success: false, message: err.message || "Something went wrong" };
  }
};

export const checkWalletBalance = async (userId: string) => {
  try {
    const value = (await cache.get(cacheType.WALLET_BALANCE, [userId])) as cachedWalletBalance;
    if (value && value.balance) {
      return { success: true, balance: value.balance };
    }

    const wallet = await db.walletBalance.findUnique({
      where: { userId: userId },
      select: {
        balance: true,
      },
    });
    if (!wallet || !wallet.balance) {
      return { success: false, message: "Wallet not found" };
    }

    await cache.set(cacheType.WALLET_BALANCE, [userId], { balance: wallet.balance });

    return { success: true, balance: wallet.balance };
  } catch (err: any) {
    return { success: false, message: err.message || "Something went wrong" };
  }
};

export const createP2PTransaction = async ({ txn, ...props }: CreateP2PTxnProps) => {
  const transaction = await txn.p2pTransaction.create({
    data: {
      amount: props.amount,
      status: "PROCESSING",
      senderUserId: props.userId,
      receiverUserId: props.receiverId,
      senderIdentifier: props.userUPI,
      receiverIdentifier: props.receiverIdentifier,
      transferMethod: props.transferMethod,
      type: "TRANSFER",
      webhookId: crypto.randomUUID(),
      webhookStatus: "PENDING",
      lastWebhookAttempt: new Date(),
      webhookAttempts: 1,
      initiatedFromIp: props.ipAddress,
      userAgent: props.userAgent,
    },
  });

  return { ...transaction };
};

export const prepareWebhookPayload = async ({
  transaction,
  props,
  receiverId,
}: webhookPayloadProps): Promise<P2PWebhookPayload> => {
  // TODO: why are we sending pin here? since we are already validating before no need here.
  const dataToBeEncrypted = await encryptData(
    {
      pin: props.pin,
      senderId: props.userId,
      receiverId,
    },
    WEBHOOK_SECRET
  );
  const payload = {
    encryptData: dataToBeEncrypted,
    body: {
      webhookId: transaction.webhookId,
      transferMethod: props.transferMethod,
      senderIdentifier: transaction.senderIdentifier,
      receiverIdentifier: props.receiverIdentifier,
      amount: props.amount,
    },
  };

  return { ...payload };
};

export const processTransactionWebhook = async (
  transactionId: string,
  webhookPayload: P2PWebhookPayload
) => {
  try {
    const response: P2PWebhookResponse = await callP2PWebhook(webhookPayload);

    if (response && !response.success) {
      throw new Error(response.message);
    }

    const p2pTxn = await db.p2pTransaction.findUnique({
      where: { id: transactionId },
      select: { webhookStatus: true },
    });
    if (p2pTxn?.webhookStatus !== "COMPLETED") {
      throw new Error(response.message);
    }

    return response;
  } catch (error: any) {
    if (error.code === "ECONNABORTED" || error.message.includes("timeout")) {
      // Network-related timeout
      console.error(`> Network/timeout issue while processing webhook: ${error.message}`);
    } else {
      console.error(`> Error processing webhook: ${error.message}`);
    }

    // Rollback transaction: Failure
    await db.p2pTransaction.update({
      where: { id: transactionId },
      data: { status: "FAILURE", webhookStatus: "FAILED" },
    });
    throw new Error(`Transaction failed: ${error.message}`);
  }
};
