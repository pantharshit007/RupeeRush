"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import {
  Wallet,
  Users,
  Building2,
  ArrowUpRight,
  IndianRupee,
  ArrowDownLeft,
  RefreshCcw,
} from "lucide-react";
import { Button } from "@repo/ui/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@repo/ui/components/ui/card";
import Title from "@repo/ui/components/custom/Title";
import { useBalanceState } from "@repo/store/balance";

import { useCurrentUser } from "@/hooks/UseCurrentUser";
import { getBalanceAction } from "@/actions/transaction/wallet/balance";
import { getAllTransactionAction, TransactionResponse } from "@/actions/getAllTransaction";
import { TransactionStatus, TransactionType } from "@repo/schema/types";
import { formatDate } from "@/utils/data";

export default function DashboardHome() {
  const [balance, setBalance] = useBalanceState();
  const [transactions, setTransactions] = useState<TransactionResponse[] | null>(null);
  const user = useCurrentUser();

  const fetchData = useCallback(async () => {
    if (!user?.id) return;

    const [balanceRes, transactionRes] = await Promise.all([
      getBalanceAction(user.id),
      getAllTransactionAction(user.id),
    ]);

    setBalance(balanceRes);
    setTransactions(transactionRes.data!);
  }, [user?.id, setBalance]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return (
    <div className="p-6 space-y-6">
      <Title title={`Welcome back, ${user?.name?.split(" ")[0]}`} />

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <QuickStatCard
          title="Current Balance"
          t1="Wallet:"
          t2="Bank:"
          value1={`₹${(balance?.walletBalance! / 100)?.toFixed(2) || 0.0}`}
          value2={`₹${(balance?.bankBalance! / 100)?.toFixed(2) || 0.0}`}
          icon={<IndianRupee className="h-4 w-4 text-muted-foreground" />}
        />
        <QuickAccessCard
          title="Wallet"
          description="Manage your funds"
          icon={<Wallet className="h-4 w-4" />}
          href="/dashboard/wallet-transfer"
        />
        <QuickAccessCard
          title="P2P Transfers"
          description="Send money to friends"
          icon={<Users className="h-4 w-4" />}
          href="/dashboard/p2p-transfer"
        />
        <QuickAccessCard
          title="B2B Payments"
          description="Business transactions"
          icon={<Building2 className="h-4 w-4" />}
          href="/dashboard/b2b-transfer"
        />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Transactions</CardTitle>
          <CardDescription>Your latest activity across all accounts</CardDescription>
        </CardHeader>
        <CardContent>
          {!transactions ? (
            <div className="text-center py-4 text-gray-500">No recent transactions</div>
          ) : (
            <>
              <div className="space-y-4">
                {transactions?.slice(0, 4).map((txn) => (
                  <div key={txn.id} className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      {getTransactionIcon(txn.type)}
                      <div>
                        <p className="text-sm font-medium">{getTransactionDescription(txn)}</p>
                        <p className="text-xs text-muted-foreground">
                          {formatDate(txn.date, true)}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2 max-sm:flex-col max-sm:space-y-2">
                      <div className={`text-sm font-medium ${getAmountColor(txn.type)}`}>
                        {getAmountPrefix(txn.type)}₹{(txn.amount / 100).toFixed(2)}
                      </div>
                      {getStatusBadge(txn.status)}
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-4 text-right">
                <Link
                  href="/dashboard/transactions"
                  className="text-sm text-blue-600 hover:underline"
                >
                  View all transactions
                </Link>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function QuickStatCard({
  title,
  t1,
  t2,
  value1,
  value2,
  icon,
}: {
  title: string;
  t1: string;
  t2: string;
  value1: string;
  value2: string;
  icon: React.ReactNode;
}) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        <div className="text-lg font-medium">
          {t1} <span className="font-mono text-azureBlue-400">{value1}</span>
        </div>
        <div className="text-lg font-medium">
          {t2} <span className="font-mono text-azureBlue-400">{value2}</span>
        </div>
      </CardContent>
    </Card>
  );
}

function QuickAccessCard({
  title,
  description,
  icon,
  href,
}: {
  title: string;
  description: string;
  icon: React.ReactNode;
  href: string;
}) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        <p className="text-xs text-muted-foreground">{description}</p>
        <Link href={href} passHref>
          <Button className="mt-2 w-full" variant="outline">
            Access
            <ArrowUpRight className="ml-2 h-4 w-4" />
          </Button>
        </Link>
      </CardContent>
    </Card>
  );
}

function getTransactionIcon(type: TransactionType) {
  switch (type) {
    case TransactionType.DEPOSIT:
      return <ArrowDownLeft className="h-6 w-6 text-green-500" />;
    case TransactionType.WITHDRAW:
      return <ArrowUpRight className="h-6 w-6 text-red-500" />;
    case TransactionType.TRANSFER:
      return <RefreshCcw className="h-6 w-6 text-blue-500" />;
    case TransactionType.RECEIVE:
      return <ArrowDownLeft className="h-6 w-6 text-green-500" />;
  }
}

function getTransactionDescription(transaction: TransactionResponse) {
  switch (transaction.type) {
    case TransactionType.DEPOSIT:
      return `Deposit to ${transaction.recipientOrSender}`;
    case TransactionType.WITHDRAW:
      return `Withdrawal from ${transaction.recipientOrSender}`;
    case TransactionType.TRANSFER:
      return `Transfer to ${transaction.recipientOrSender}`;
    case TransactionType.RECEIVE:
      return `Received from ${transaction.recipientOrSender}`;
  }
}

function getAmountColor(type: TransactionType) {
  switch (type) {
    case TransactionType.DEPOSIT:
    case TransactionType.RECEIVE:
      return "text-green-600";
    case TransactionType.WITHDRAW:
    case TransactionType.TRANSFER:
      return "text-red-600";
  }
}

function getAmountPrefix(type: TransactionType) {
  switch (type) {
    case TransactionType.DEPOSIT:
    case TransactionType.RECEIVE:
      return "+";
    case TransactionType.WITHDRAW:
    case TransactionType.TRANSFER:
      return "-";
  }
}

function getStatusBadge(status: TransactionStatus) {
  let color;
  switch (status) {
    case TransactionStatus.SUCCESS:
      color = "bg-green-100 text-green-800";
      break;
    case TransactionStatus.FAILURE:
      color = "bg-red-100 text-red-800";
      break;
    case TransactionStatus.PROCESSING:
      color = "bg-yellow-100 text-yellow-800";
      break;
  }
  return <span className={`px-2 py-1 rounded-full text-xs font-medium ${color}`}>{status}</span>;
}
