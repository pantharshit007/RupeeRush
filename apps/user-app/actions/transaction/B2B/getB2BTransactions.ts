"use server";

import { auth } from "@/lib/auth";
import { cache, cacheType } from "@repo/db/cache";
import db from "@repo/db/client";

interface B2BTransaction {
  timestamp: Date;
  amount: number;
  status: string;
  type: string;
  senderAccountNumber: string;
  receiverAccountNumber: string;
  senderBankName: string;
  receiverBankName: string;
  senderUserId: string;
  receiverUserId: string;
  id: string;
}

/**
 * Fetch user's B2B transactions
 * @param userId
 * @returns last 3 transactions
 */
export const getB2BTransActions = async (userId: string): Promise<any> => {
  const session = await auth();

  try {
    if (!session?.user) {
      throw new Error("Unauthorized!");
    }

    if (session.user.id !== userId) {
      throw new Error("Forbidden!");
    }

    const txnValue = await cache.get(cacheType.B2B_TRANSACTION, [userId]);
    if (txnValue) {
      return txnValue;
    }

    const transaction = await db.b2bTransaction.findMany({
      where: {
        OR: [{ senderUserId: userId }, { receiverUserId: userId }],
      },
      orderBy: {
        timestamp: "desc",
      },
      take: 3,
    });

    if (!transaction || !transaction[0]?.senderAccountNumber) {
      return [];
    }

    const txn = transaction.map((txn: any) => ({
      timestamp: txn.timestamp,
      amount: txn.amount,
      status: txn.status,
      type: txn.type,
      senderAccountNumber: txn.senderAccountNumber! as string,
      receiverAccountNumber: txn.receiverAccountNumber! as string,
      senderBankName: txn.senderBankName,
      receiverBankName: txn.receiverBankName,
      senderUserId: txn.senderUserId! as string,
      receiverUserId: txn.receiverUserId! as string,
      id: txn.id,
    }));

    await cache.set(cacheType.B2B_TRANSACTION, [userId], txn);
    return txn;
  } catch (err: any) {
    console.error("> Error while fetching B2B Transaction:", err.message);
    return [];
  }
};
