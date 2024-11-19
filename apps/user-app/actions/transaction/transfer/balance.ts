"use server";

import db from "@repo/db/client";

/**
 *  returns user's `walletbalance` and `bankbalance`
 * @param userId
 */
export const getBalanceAction = async (userId: string) => {
  try {
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

    return {
      walletBalance: allBalance?.walletBalance?.balance ?? 0,
      bankBalance: allBalance?.bankAccount?.balance ?? 0,
    };
  } catch (err) {
    console.error("> Error getting balance: ", err);
    return { walletBalance: 0, bankBalance: 0 };
  }
};
