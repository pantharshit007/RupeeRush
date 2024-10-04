"use server";

import db from "@repo/db/client";

export async function getP2PTransactions(userId: number | string) {
  try {
    const transaction = await db.p2pTransfer.findMany({
      where: {
        senderUserId: Number(userId),
      },
    });

    return transaction.map((txn: any) => ({
      time: txn.timestamp,
      amount: txn.amount,
      status: txn.status,
      provider: "HDFC",
    }));
  } catch (err: any) {
    console.error("> Error while fetching P2P Transaction:", err.message);
    return [];
  }
}
