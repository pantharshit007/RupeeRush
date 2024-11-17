"use server";

import { randomUUID } from "crypto";
import { compare } from "bcryptjs";
import db, { SchemaTypes } from "@repo/db/client";

export async function createOnRampTransaction(
  provider: SchemaTypes.Bank,
  amount: number,
  userId: string,
  pin: string
) {
  //TODO: Ideally the token should come from the banking provider (hdfc/axis)

  try {
    const userData = await db.user.findUnique({
      where: { id: userId },
      select: { id: true, walletPin: true },
    });

    if (!userData || !userData.walletPin) {
      return { error: "Invalid Pin" };
    }

    const isValidPin = await compare(pin, userData.walletPin);
    if (!isValidPin) {
      return { error: "Invalid Pin" };
    }

    const bankData = await db.bankAccount.findUnique({
      where: { userId: userData.id },
      select: { balance: true, bankName: true },
    });

    if (!bankData || bankData?.bankName !== provider) {
      return { error: "No account found in " + provider };
    }

    if (bankData?.balance < amount * 100) {
      return { error: "Insufficient Balance" };
    }

    const token = randomUUID();
    const txnData = {
      provider: provider,
      status: "PROCESSING" as SchemaTypes.TransactionStatus,
      startTime: new Date(),
      token: token,
      userId: userId,
      amount: amount * 100,
    };

    const rampTxn = await db.onRampTransaction.create({ data: txnData });

    await db.$transaction(async (txn: any) => {
      await txn.walletBalance.update({
        where: { userId },
        data: {
          balance: { increment: amount * 100 },
        },
      });

      await txn.bankAccount.update({
        where: { userId: userData?.id },
        data: {
          balance: { decrement: amount * 100 },
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
      success: "Money Added to Wallet",
    };
  } catch (err: any) {
    console.error("> Failed to add money in wallet:", err.message);
    return {
      error: "Failed to add money in wallet",
    };
  }
}
