import React from "react";

import Title from "@repo/ui/title";
import Tab from "@repo/ui/tab";

import DepositCard from "../../../components/DepositCard";
import BalanceCard from "../../../components/BalanceCard";
import TransactionHistory from "../../../components/TxnHistoryCard";
import { getServerSession } from "next-auth";
import { authOptions } from "../../lib/auth";
import db from "@repo/db/client";
import { redirect } from "next/navigation";

const demoTxn = [
  {
    time: new Date("2023-09-15T10:00:00"),
    amount: 5000, // Amount in cents (50.00 INR)
    status: "Success",
    provider: "HDFC Bank",
  },
  {
    time: new Date("2023-09-14T15:30:00"),
    amount: 12000, // Amount in cents (120.00 INR)
    status: "Failure",
    provider: "ICICI Bank",
  },
  {
    time: new Date("2023-09-13T11:45:00"),
    amount: 7500, // Amount in cents (75.00 INR)
    status: "Processing",
    provider: "SBI Bank",
  },
  {
    time: new Date("2023-09-12T08:20:00"),
    amount: 15000, // Amount in cents (150.00 INR)
    status: "Success",
    provider: "Axis Bank",
  },
];

// fetch user's current Balance and locked balance
async function getBalance() {
  try {
    const session = await getServerSession(authOptions);
    const balance = await db.balance.findFirst({
      where: {
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
    const session = await getServerSession(authOptions);

    const transaction = await db.onRampTransaction.findMany({
      where: {
        userId: Number(session?.user?.id),
      },
    });

    return transaction.map((txn) => ({
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
  const session = await getServerSession(authOptions);

  // Check if the user is not logged in
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
          <BalanceCard
            amount={balance?.amount || 0}
            locked={balance?.lockedBalance || 0}
          />
          {/* @ts-ignore */}
          <TransactionHistory transactions={transaction} />
        </div>
      </div>
    </div>
  );
}

export default page;
