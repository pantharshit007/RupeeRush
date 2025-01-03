"use server";

import { compare } from "bcryptjs";
import db, { SchemaTypes } from "@repo/db/client";
import { cache, cacheType } from "@repo/db/cache";
import { auth } from "@/lib/auth";

/**
 * Fetch user's Transaction of withdraw/deposit
 * @param userId
 * @returns a list of last 3 transactions
 */
export const getOnRampTxnAction = async (userId: string) => {
  const session = await auth();
  try {
    if (!session?.user) {
      throw new Error("Unauthorized!");
    }
    if (session.user.id !== userId) {
      throw new Error("Forbidden!");
    }

    const txnValue = await cache.get(cacheType.ON_RAMP_TRANSACTION, [userId]);
    if (txnValue) {
      return txnValue;
    }

    const transactions = await db.onRampTransaction.findMany({
      where: { userId },
      orderBy: { startTime: "desc" },
      take: 3,
    });

    const txn = transactions.map((txn: any) => ({
      startTime: txn.startTime,
      amount: txn.amount,
      status: txn.status,
      type: txn.type,
      provider: txn.provider,
    }));

    await cache.set(cacheType.ON_RAMP_TRANSACTION, [userId], txn);
    return txn;
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
  const session = await auth();

  try {
    if (!session || !session?.user?.id) {
      throw new Error("Unauthrized!");
    }

    if (session.user.id !== userId) {
      throw new Error("Forbidden!");
    }

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

    const result = await db.$transaction(async (txn) => {
      const wallet = await txn.walletBalance.update({
        where: { userId },
        data: {
          balance: {
            [type === "deposit" ? "increment" : "decrement"]: amountInPaise,
          },
        },
      });

      const bankAccount = await txn.bankAccount.update({
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

      // setting cache again
      const transactions = await txn.onRampTransaction.findMany({
        where: { userId },
        orderBy: { startTime: "desc" },
        take: 3,
      });

      await cache.evict(cacheType.ON_RAMP_TRANSACTION, [userId]);
      await cache.set(cacheType.ON_RAMP_TRANSACTION, [userId], transactions);
      await cache.evict(cacheType.WALLET_BALANCE, [userId]);
      await cache.evict(cacheType.BANK_BALANCE, [userId]);
      await cache.evict(cacheType.TRANSACTION_PAGE, [userId, "page", "1"]); // clearing cache for transaction page

      return { wallet: wallet.balance, bankAccount: bankAccount.balance };
    });

    return {
      success: `Money ${type === "deposit" ? "Added to" : "Withdrawn from"} Wallet`,
      res: { walletBalance: result.wallet, bankBalance: result.bankAccount },
    };
  } catch (err: any) {
    console.error(`> Failed to ${type} money:`, err.message);
    return {
      error: `Failed to ${type} money: ` + err.message,
    };
  }
};
