"use server";

import { auth } from "@/lib/auth";
import { cache, cacheType } from "@repo/db/cache";
import db from "@repo/db/client";

/**
 * Fetch user's P2P Transaction
 * @param userId
 * @returns last 3 transactions
 */
export async function getP2PTransActions(userId: string) {
  const session = await auth();
  try {
    if (!session?.user) {
      throw new Error("Unauthorized!");
    }
    if (session.user.id !== userId) {
      throw new Error("Forbidden!");
    }

    const txnValue = await cache.get(cacheType.P2P_TRANSACTION, [userId]);
    if (txnValue) {
      return txnValue;
    }

    const transaction = await db.p2pTransaction.findMany({
      where: {
        OR: [{ senderUserId: userId }, { receiverUserId: userId }],
      },
      orderBy: {
        timestamp: "desc",
      },
      take: 3,
    });

    const txn = transaction.map((txn: any) => ({
      timestamp: txn.timestamp,
      amount: txn.amount,
      status: txn.status,
      type: txn.type,
      senderIdentifier: txn.senderIdentifier,
      receiverIdentifier: txn.receiverIdentifier,
      senderUserId: txn.senderUserId,
      receiverUserId: txn.receiverUserId,
      transferMethod: txn.transferMethod,
      id: txn.id,
    }));

    await cache.set(cacheType.P2P_TRANSACTION, [userId], txn);
    return txn;
  } catch (err: any) {
    console.error("> Error while fetching P2P Transaction:", err.message);
    return [];
  }
}
