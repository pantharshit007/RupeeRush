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
    await cache.set(cacheType.CREDIT_CARD, [userId], creditCards);
    return creditCards;
  } catch (err: any) {
    console.error("Error fetching credit card details:", err);
    return null;
  }
};
