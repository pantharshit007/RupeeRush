"use server";

import { auth } from "@/lib/auth";
import { cache } from "@repo/db/cache";
import db from "@repo/db/client";

interface Balance {
  walletBalance: number;
  bankBalance: number;
}

/**
 *  returns user's `walletbalance` and `bankbalance`
 * @param userId
 */
export const getBalanceAction = async (userId: string): Promise<Balance> => {
  const session = await auth();
  if (!session || session?.user?.id !== userId) {
    return { walletBalance: 0, bankBalance: 0 };
  }

  try {
    const balanceValue: Balance = await cache.get("wallet-bank-balance", [userId]);
    if (balanceValue) {
      return { walletBalance: balanceValue.walletBalance, bankBalance: balanceValue.bankBalance };
    }

    // get balance from db
    const allBalance = await db.user.findUnique({
      where: { id: userId },
      select: {
        walletBalance: {
          select: {
            balance: true,
          },
        },
        bankAccount: {
          select: {
            balance: true,
          },
        },
      },
    });

    const cachedBalance = {
      walletBalance: allBalance?.walletBalance?.balance ?? 0,
      bankBalance: allBalance?.bankAccount?.balance ?? 0,
    };
    await cache.set("wallet-bank-balance", [userId], cachedBalance);

    return cachedBalance;
  } catch (err) {
    console.error("> Error getting balance: ", err);
    return { walletBalance: 0, bankBalance: 0 };
  }
};
