"use server";

import { auth } from "@/lib/auth";
import { cache, cacheType } from "@repo/db/cache";
import db from "@repo/db/client";
import { cachedBankBalance, cachedWalletBalance } from "@repo/schema/types";

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
    const wallet = (await cache.get(cacheType.WALLET_BALANCE, [userId])) as cachedWalletBalance;
    const bank = (await cache.get(cacheType.BANK_BALANCE, [userId])) as cachedBankBalance;

    if (wallet && bank) {
      return { walletBalance: wallet.balance, bankBalance: bank.balance };
    }

    // get balance from db
    const walletBalance =
      wallet ??
      (await db.walletBalance.findUnique({
        where: { userId },
        select: { balance: true },
      }));
    if (!walletBalance) {
      return { walletBalance: 0, bankBalance: 0 };
    }

    const bankAccount =
      bank ??
      (await db.bankAccount.findUnique({
        where: { userId },
        select: { balance: true },
      }));
    if (!bankAccount) {
      return { walletBalance: 0, bankBalance: 0 };
    }

    await cache.set(cacheType.WALLET_BALANCE, [userId], { balance: walletBalance.balance });
    await cache.set(cacheType.BANK_BALANCE, [userId], { balance: bankAccount.balance });

    const allBalance = {
      walletBalance: walletBalance?.balance ?? 0,
      bankBalance: bankAccount?.balance ?? 0,
    };

    return allBalance;
  } catch (err) {
    console.error("> Error getting balance:", err);
    return { walletBalance: 0, bankBalance: 0 };
  }
};
