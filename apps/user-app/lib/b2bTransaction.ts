import db, { SchemaTypes } from "@repo/db/client";
import { CreateB2BTxnActionProps } from "@/actions/transaction/B2B/b2b";
import { encryptData } from "@repo/common/encryption";
import { callB2BWebhook } from "@/lib/api";
import { B2BWebhookPayload } from "@repo/schema/types";

const WEBHOOK_BANK_SECRET = process.env.WEBHOOK_BANK_SECRET ?? "superSecret";

interface transaction {
  txn: Omit<
    // @ts-ignore
    SchemaTypes.PrismaClient<SchemaTypes.Prisma.PrismaClientOptions, never, DefaultArgs>,
    "$connect" | "$disconnect" | "$on" | "$transaction" | "$use" | "$extends"
  >;
}

interface CreateB2BTxnProps extends transaction {
  txn: transaction["txn"];
  receiverId: string;
  senderId: string;
  amount: number;
  senderAccountNumber: string;
  receiverAccountNumber: string;
  senderBank: string;
  receiverBank: string;
}

export interface B2BTxn {
  id: string;
  amount: number;
  status: string;
  senderUserId: string | null;
  receiverUserId: string | null;
  senderAccountNumber: string | null;
  receiverAccountNumber: string | null;
  senderBankName: string;
  receiverBankName: string;
  type: string;
  webhookId: string | null;
  webhookStatus: string | null;
  lastWebhookAttempt: Date | null;
  webhookAttempts: number;
}

interface WebhookPayloadProps {
  transaction: B2BTxn;
  props: CreateB2BTxnActionProps;
  receiverId: string;
}

export const validateAccountNumber = async (accountNumber: string) => {
  const receiver = await db.bankAccount.findUnique({
    where: { accountNumber: accountNumber },
    select: { userId: true, bankName: true },
  });

  if (!receiver) {
    return { success: false, message: "Receiver not found" };
  }

  return { success: true, receiver };
};

export const createB2BTransaction = async ({
  txn,
  ...props
}: CreateB2BTxnProps): Promise<B2BTxn> => {
  const transaction = await txn.b2bTransaction.create({
    data: {
      amount: props.amount,
      status: "PROCESSING",
      senderUserId: props.senderId,
      receiverUserId: props.receiverId,
      senderAccountNumber: props.senderAccountNumber,
      receiverAccountNumber: props.receiverAccountNumber,
      senderBankName: props.senderBank,
      receiverBankName: props.receiverBank,
      type: "TRANSFER",
      webhookId: crypto.randomUUID(),
      webhookStatus: "PENDING",
      lastWebhookAttempt: new Date(),
      webhookAttempts: 1,
    },
  });

  return { ...transaction };
};

export const prepareWebhookPayload = async ({
  transaction,
  props,
  receiverId,
}: WebhookPayloadProps): Promise<B2BWebhookPayload> => {
  const dataToBeEncrypted = await encryptData(
    { senderId: props.senderId, receiverId, txnId: transaction.id },
    WEBHOOK_BANK_SECRET
  );
  const payload = {
    encryptData: dataToBeEncrypted,
    body: {
      webhookId: transaction.webhookId,
      senderIdentifier: transaction.senderAccountNumber,
      receiverIdentifier: transaction.receiverAccountNumber,
      amount: props.amount,
    },
  };

  return { ...payload };
};

export const processTransactionWebhook = async (
  transactionId: string,
  webhookPayload: B2BWebhookPayload
) => {
  try {
    const response = await callB2BWebhook(webhookPayload);

    if (response && !response.success) {
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
    await db.b2bTransaction.update({
      where: { id: transactionId },
      data: { status: "FAILURE", webhookStatus: "FAILED" },
    });
    throw new Error(`Transaction failed: ${error.message}`);
  }
};
