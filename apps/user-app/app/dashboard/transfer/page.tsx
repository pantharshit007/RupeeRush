import React from "react";

import Title from "@repo/ui/components/title";
import Tab from "@repo/ui/components/tab";

import DepositCard from "@/components/DepositCard";
import BalanceCard from "@/components/BalanceCard";
import TransactionHistory from "@/components/TxnHistoryCard";
import { auth } from "@/lib/auth";
import db from "@repo/db/client";
import { redirect } from "next/navigation";

// fetch user's current Balance and locked balance
async function getBalance() {
  try {
    const session = await auth();
    const balance = await db.balance.findFirst({
      where: {
        // @ts-ignore
        userId: Number(session?.user?.id),
      },
    });

    return {
      amount: balance?.amount || 0,
      lockedBalance: balance?.locked || 0,
    };
  } catch (err: any) {
    console.error("> Error while fetching Balance:", err.message);
    return;
  }
}

// fetch user's Transaction of withdraw/deposit
async function getOnRampTransactions() {
  try {
    const session = await auth();

    const transaction = await db.onRampTransaction.findMany({
      where: {
        // @ts-ignore
        userId: Number(session?.user?.id),
      },
    });

    return transaction.map((txn: any) => ({
      time: txn.startTime,
      amount: txn.amount,
      status: txn.status,
      provider: txn.provider,
    }));
  } catch (err: any) {
    console.error("> Error while fetching Transaction:", err.message);
    return;
  }
}

async function page() {
  const session = await auth();

  // Check if the user is not logged in
  // @ts-ignore
  if (!session?.user?.id) {
    redirect("/api/auth/signin");
  }

  const balance = await getBalance();
  const transaction = await getOnRampTransactions();

  return (
    <div className="w-full pl-3">
      <Title title={"Transfer"} />
      <Tab />

      <div className="w-[calc(100%-32px)] mx-1 mt-2 grid grid-cols-1 md:grid-cols-2 gap-4">
        <DepositCard />

        <div className="flex flex-col w-full gap-y-4">
          <BalanceCard amount={balance?.amount || 0} locked={balance?.lockedBalance || 0} />
          {/* @ts-ignore */}
          <TransactionHistory transactions={transaction} />
        </div>
      </div>
    </div>
  );
}

export default page;
