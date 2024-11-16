"use server";

// import { getServerSession } from "next-auth";
import { auth } from "@/lib/auth";
import { randomUUID } from "crypto";
import db, { SchemaTypes } from "@repo/db/client";

export async function createOnRampTransaction(
  provider: SchemaTypes.Bank,
  amount: number,
  userId: string
) {
  //TODO: Ideally the token should come from the banking provider (hdfc/axis)

  try {
    const session = await auth();
    const userId = session?.user?.id;
    if (!session?.user || !userId) {
      return {
        success: false,
        message: "Unathenticated Request",
      };
    }

    const token = randomUUID();
    await db.onRampTransaction.create({
      data: {
        provider: provider,
        status: "PROCESSING",
        startTime: new Date(),
        token: token,
        userId: userId,
        amount: amount * 100,
      },
    });

    await db.walletBalance.update({
      where: { userId },
      data: {
        locked: { increment: amount },
      },
    });

    return {
      success: true,
      message: "Transaction Recorded.",
    };
  } catch (err: any) {
    console.error("> Failed to record transaction", err.message);
    return {
      success: false,
      message: "Failed to record transaction",
    };
  }
}
