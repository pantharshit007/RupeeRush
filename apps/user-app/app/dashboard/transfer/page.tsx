import React from "react";
import { redirect } from "next/navigation";

import Title from "@repo/ui/components/custom/Title";
import Tab from "@repo/ui/components/custom/Tab";
import DepositWithdrawCard from "@/components/DepositCard";
import BalanceCard from "@/components/BalanceCard";
import TransactionHistory from "@/components/TxnHistoryCard";
import { auth } from "@/lib/auth";
import db from "@repo/db/client";
import { Card, CardContent, CardHeader, CardTitle } from "@repo/ui/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@repo/ui/components/ui/tabs";

// fetch user's current Balance and locked balance
async function getBalance(userId: string) {
  try {
    const balance = await db.walletBalance.findFirst({
      where: { userId },
    });
    return {
      amount: balance?.balance || 0,
      lockedBalance: balance?.locked || 0,
    };
  } catch (err: any) {
    console.error("> Error while fetching Balance:", err.message);
    return { amount: 0, lockedBalance: 0 };
  }
}

// fetch user's Transaction of withdraw/deposit
async function getOnRampTransactions(userId: string) {
  try {
    const transactions = await db.onRampTransaction.findMany({
      where: { userId },
      orderBy: { startTime: "desc" },
      take: 3,
    });
    return transactions.map((txn: any) => ({
      time: txn.startTime,
      amount: txn.amount,
      status: txn.status,
      provider: txn.provider,
    }));
  } catch (err: any) {
    console.error("> Error while fetching Transaction:", err.message);
    return [];
  }
}

async function page() {
  const session = await auth();

  // Check if the user is not logged in
  if (!session?.user?.id) {
    redirect("/api/auth/signin");
  }

  const balance = await getBalance(session.user.id);
  const transactions = await getOnRampTransactions(session.user.id);

  return (
    <>
      <div className="">
        <Title title={"Transfer"} />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
          <Tabs defaultValue="deposit" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="deposit" className=" data-[state=active]:text-sky-600">
                Deposit
              </TabsTrigger>
              <TabsTrigger value="withdraw" className="data-[state=active]:text-sky-600">
                Withdraw
              </TabsTrigger>
            </TabsList>
            <TabsContent value="deposit">
              <DepositWithdrawCard type="deposit" />
            </TabsContent>
            <TabsContent value="withdraw">
              <DepositWithdrawCard type="withdraw" />
            </TabsContent>
          </Tabs>

          {/* <DepositWithdrawCard type="deposit" /> */}
          <div className="space-y-4">
            <BalanceCard amount={balance.amount} locked={balance.lockedBalance} />
            <TransactionHistory transactions={transactions} />
          </div>
        </div>
      </div>

      {/* <div className="w-full pl-3">
        <Title title={"Transfer"} />
        <Tab />

        <div className="w-[calc(100%-32px)] mx-1 mt-2 grid grid-cols-1 md:grid-cols-2 gap-4">
          <DepositCard />

          <div className="flex flex-col w-full gap-y-4">
            <BalanceCard amount={balance?.amount || 0} locked={balance?.lockedBalance || 0} />
            <TransactionHistory transactions={transactions} />
          </div>
        </div>
      </div> */}
    </>
  );
}

export default page;
