"use server";

import { auth } from "@/lib/auth";
import { cache, cacheType } from "@repo/db/cache";
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
    const wallet = await cache.get(cacheType.WALLET_BALANCE, [userId]);
    const bank = await cache.get(cacheType.BANK_BALANCE, [userId]);

    if (wallet && bank) {
      return { walletBalance: wallet, bankBalance: bank };
    }

    // get balance from db
    const walletBalance = await db.walletBalance.findUnique({
      where: { userId },
      select: { balance: true },
    });
    if (!walletBalance) {
      return { walletBalance: 0, bankBalance: 0 };
    }

    const bankAccount = await db.bankAccount.findUnique({
      where: { userId },
      select: { balance: true },
    });
    if (!bankAccount) {
      return { walletBalance: 0, bankBalance: 0 };
    }

    await cache.set(cacheType.WALLET_BALANCE, [userId], walletBalance.balance);
    await cache.set(cacheType.BANK_BALANCE, [userId], bankAccount.balance);

    const allBalance = {
      walletBalance: walletBalance?.balance ?? 0,
      bankBalance: bankAccount?.balance ?? 0,
    };

    return allBalance;
  } catch (err) {
    console.error("> Error getting balance: ", err);
    return { walletBalance: 0, bankBalance: 0 };
  }
};
