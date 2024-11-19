"use server";

import db, { SchemaTypes } from "@repo/db/client";
import { compare } from "bcryptjs";

/**
 * Fetch user's Transaction of withdraw/deposit
 * @param userId
 * @returns a list of last 3 transactions
 */
export const getOnRampTxnAction = async (userId: string) => {
  try {
    const transactions = await db.onRampTransaction.findMany({
      where: { userId },
      orderBy: { startTime: "desc" },
      take: 3,
    });
    return transactions.map((txn: any) => ({
      time: txn.startTime,
      amount: txn.amount,
      status: txn.status,
      type: txn.type,
      provider: txn.provider,
    }));
  } catch (err: any) {
    console.error("> Error while fetching Transaction:", err.message);
    return [];
  }
};

interface CreateOnRampTransactionProps {
  provider: SchemaTypes.Bank;
  amount: number;
  userId: string;
  pin: string;
  type: "deposit" | "withdraw";
}

/**
 * Create a transaction of deposit or withdraw
 * @param provider
 * @param amount
 * @param userId
 * @param pin
 * @param type
 * @returns
 */
export const createOnRampTxnAction = async ({
  provider,
  amount,
  userId,
  pin,
  type,
}: CreateOnRampTransactionProps) => {
  try {
    const userData = await db.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        walletPin: true,
        walletBalance: { select: { balance: true } },
        bankAccount: { select: { balance: true, bankName: true } },
      },
    });

    if (!userData || !userData.walletPin || !(await compare(pin, userData.walletPin))) {
      return { error: "Invalid Pin" };
    }

    const { walletBalance, bankAccount } = userData;

    if (!bankAccount || bankAccount.bankName !== provider || !walletBalance) {
      return { error: `No account found in ${provider}` };
    }

    const amountInPaise = amount * 100; // 1 Rs = 100 Paise

    if (type === "withdraw" && walletBalance.balance < amountInPaise) {
      return { error: "Insufficient Balance in Wallet" };
    }

    if (type === "deposit" && bankAccount.balance < amountInPaise) {
      return { error: "Insufficient Balance in Bank" };
    }

    const txnData = {
      provider,
      status: "PROCESSING" as SchemaTypes.TransactionStatus,
      startTime: new Date(),
      type: type.toUpperCase() as SchemaTypes.TransactionType,
      userId,
      amount: amountInPaise,
    };

    const rampTxn = await db.onRampTransaction.create({ data: txnData });

    await db.$transaction(async (txn) => {
      await txn.walletBalance.update({
        where: { userId },
        data: {
          balance: {
            [type === "deposit" ? "increment" : "decrement"]: amountInPaise,
          },
        },
      });

      await txn.bankAccount.update({
        where: { userId: userData.id },
        data: {
          balance: {
            [type === "deposit" ? "decrement" : "increment"]: amountInPaise,
          },
        },
      });

      await txn.onRampTransaction.update({
        where: { id: rampTxn.id },
        data: {
          status: "SUCCESS" as SchemaTypes.TransactionStatus,
        },
      });
    });

    return {
      success: `Money ${type === "deposit" ? "Added to" : "Withdrawn from"} Wallet`,
    };
  } catch (err: any) {
    console.error(`> Failed to ${type} money:`, err.message);
    return {
      error: `Failed to ${type} money`,
    };
  }
};
