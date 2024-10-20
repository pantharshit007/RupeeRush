"use server";

import { getServerSession } from "next-auth";
import { authOptions } from "../auth";
import { randomUUID } from "crypto";
import db from "@repo/db/client";

export async function createOnRampTransaction(provider: string, amount: number) {
  //TODO: Ideally the token should come from the banking provider (hdfc/axis)

  try {
    const session = await getServerSession(authOptions);
    // @ts-ignore
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
        status: "Processing",
        startTime: new Date(),
        token: token,
        userId: userId,
        amount: amount * 100,
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
