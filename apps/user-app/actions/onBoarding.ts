"use server";

import * as z from "zod";
import { onBoardingSchema } from "@repo/schema/txnSchema";
import { auth } from "@/lib/auth";
import db from "@repo/db/client";
import { SUPPORTED_BANKS } from "@/utils/constant";
import { hash } from "bcryptjs";
import { generateSecureAccountNumber } from "@/utils/data";

export interface CreditCard {
  type: string;
  name: string;
  number: string;
  cvv: string;
  expiry: string;
}

export const onBoardingAction = async (
  values: z.infer<typeof onBoardingSchema>,
  creditCard: CreditCard[],
  userId: string
) => {
  const session = await auth();

  try {
    const validatedValues = onBoardingSchema.safeParse(values);
    if (!validatedValues.success) {
      return { error: "Input is invalid" };
    }

    if (!session || !session?.user || session.user.id !== userId) {
      return { error: "Unauthorized!" };
    }

    /*
     * Onboarding Steps:
     * - select bank: HDFC/AXIS (choose random)
     * - add pin on user account (for both wallet and bank)
     * - add ph no. and create UPI Id: update user data
     * - create a wallet and bank account
     * - add money to bank and wallet (initial amount)
     */

    const isPhoneNumberAvailable = await db.user.findUnique({
      where: { phoneNumber: values.phoneNumber },
      select: { id: true },
    });

    if (isPhoneNumberAvailable) {
      return { error: "Phone number already exists" };
    }

    await db.$transaction(async (txn) => {
      const bank =
        SUPPORTED_BANKS[Math.floor(Math.random() * SUPPORTED_BANKS.length)]?.name || "AXIS";
      const hashedPin = await hash(values.pin, 10);

      const upiId = `${values.phoneNumber}@${bank.toLowerCase()}bank`;

      const user = await txn.user.update({
        where: { id: userId },
        data: {
          phoneNumber: values.phoneNumber,
          walletPin: hashedPin,
          upiId,
        },
      });

      if (!user) {
        throw new Error("User not found");
      }

      // Create wallet Account
      await txn.walletBalance.create({
        data: {
          userId: user.id,
          balance: 5_000_00, // 5,000 Rs
          locked: 0,
        },
      });

      const accountNumber = generateSecureAccountNumber(10);

      // Create bank Account
      await txn.bankAccount.create({
        data: {
          userId: user.id,
          phoneNumber: values.phoneNumber,
          bankName: bank,
          accountNumber,
          balance: 10_000_00, // 10,000 Rs
          cardType: creditCard[0]?.type!,
          cardHolder: user.name,
          cardNumber: creditCard[0]?.number!,
          cardExpiry: creditCard[0]?.expiry!,
          cardCvv: creditCard[0]?.cvv!,
          cardPinHash: hashedPin,
        },
      });
    });

    return { success: "Onboarding Successful!" };
  } catch (err: any) {
    console.error("Error onboarding user:", err);
    return { error: "Error: " + err.message };
  }
};
