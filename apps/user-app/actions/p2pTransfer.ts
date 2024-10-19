"use server";

import { getServerSession } from "next-auth";
import { authOptions } from "../lib/auth";
import db from "@repo/db/client";

interface P2PTypes {
  receiverId: string;
  amount: number;
}

export async function p2pTransfer({ receiverId, amount }: P2PTypes) {
  const session = await getServerSession(authOptions);
  // @ts-ignore
  const sender: string = session?.user?.id;

  const receiver = await db.user.findFirst({
    where: {
      phoneNumber: receiverId,
    },
  });

  // user not login
  if (!sender) {
    return {
      success: false,
      message: "User not logged in",
    };
  }

  // wrong user Id: phoneNumber/upi
  if (!receiver) {
    return {
      success: false,
      message: "User not Found!",
    };
  }

  try {
    await db.$transaction(async (txn: any) => {
      // To prevent paraller request simuntaneously we are locking the particular db row, hence until prev transaction doesnt commit no new request will be processed.
      await txn.$queryRaw`SELECT * FROM "Balance" WHERE "userId"= ${Number(sender)} FOR UPDATE`;

      const senderBalance = await txn.balance.findUnique({
        where: { userId: Number(sender) },
      });

      if (!senderBalance || senderBalance.amount < amount) {
        return {
          success: false,
          message: "Insufficient funds",
        };
      }

      // deduct amount from sender's wallet balance
      await txn.balance.update({
        where: { userId: Number(sender) },
        data: { amount: { decrement: amount } },
      });

      // increment amount in receiver's wallet balance
      await txn.balance.update({
        where: { userId: receiver.id },
        data: { amount: { increment: amount } },
      });

      // TODO: if txn fails update status to `Failue`
      // add new entry to P2P db as a transaction
      await txn.p2pTransfer.create({
        data: {
          senderUserId: Number(sender),
          receiverUserId: receiver.id,
          amount: amount,
          timestamp: new Date(),
          status: "Success",
        },
      });
    });
  } catch (err: any) {
    console.error("> P2P txn Failed:", err.message);
    return {
      success: false,
      message: "P2P txn Failed: " + err.message,
    };
  }
}
