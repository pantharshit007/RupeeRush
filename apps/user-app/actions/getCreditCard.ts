"use server";

import { CreditCardProps } from "@/components/security/CreditCard";
import { auth } from "@/lib/auth";
import { cache, cacheType } from "@repo/db/cache";
import db from "@repo/db/client";

/**
 * Fetches credit card details of a user
 * @param userId
 * @returns
 */

export const getCreditCardAction = async (userId: string): Promise<CreditCardProps | null> => {
  const session = await auth();

  try {
    if (!session || !session?.user || session.user.id !== userId) {
      return null;
    }

    const cachedCreditCardData = await cache.get(cacheType.CREDIT_CARD, [userId]);
    if (cachedCreditCardData) {
      return cachedCreditCardData;
    }

    const creditCards = await db.bankAccount.findUnique({
      where: { userId },
      select: { cardNumber: true, cardHolder: true, cardExpiry: true, cardCvv: true },
    });

    // updatin cache
    await cache.set(cacheType.CREDIT_CARD, [userId], creditCards!);
    return creditCards;
  } catch (err: any) {
    console.error("Error fetching credit card details:", err);
    return null;
  }
};

/**
 * Fetches Bank Account Number of the user
 * @param userId
 * @returns accountNo
 */
export const getAccountNoAction = async (userId: string): Promise<string | null> => {
  const session = await auth();

  try {
    if (!session || !session?.user || session.user.id !== userId) {
      return null;
    }

    const cachedAccountNo = await cache.get(cacheType.ACCOUNT_NO, [userId]);
    if (cachedAccountNo && cachedAccountNo.accountNo) {
      return cachedAccountNo.accountNo;
    }

    const accountNo = await db.bankAccount.findUnique({
      where: { userId },
      select: { accountNumber: true },
    });

    if (!accountNo) {
      return null;
    }

    // updating cache
    await cache.set(cacheType.ACCOUNT_NO, [userId], accountNo);
    return accountNo.accountNumber;
  } catch (err: any) {
    console.error("Error fetching credit card details:", err);
    return null;
  }
};
