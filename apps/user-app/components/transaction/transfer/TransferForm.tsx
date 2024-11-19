"use client";
import React, { useEffect } from "react";

import Title from "@repo/ui/components/custom/Title";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@repo/ui/components/ui/tabs";
import { useBalanceState } from "@repo/store/balance";

import BalanceCard from "@/components/transaction/BalanceCard";
import DepositCard from "@/components/transaction/transfer/DepositCard";
import { getBalanceAction } from "@/actions/transaction/transfer/balance";
import { useCurrentUser } from "@/hooks/UseCurrentUser";
import { getOnRampTxnAction } from "@/actions/transaction/transfer/onRampTransaction";
import TransferHistory from "./TransferHistory";

function TransferForm() {
  const [balance, setBalance] = useBalanceState();
  const [transactions, setTransactions] = React.useState<any>([]);
  const user = useCurrentUser();

  useEffect(() => {
    const fetchBalance = async () => {
      if (user?.id) {
        const res = await getBalanceAction(user.id);
        setBalance(res);
      }
    };

    const getWalletTransaction = async () => {
      if (user?.id) {
        const res = await getOnRampTxnAction(user.id);
        setTransactions(res);
      }
    };
    fetchBalance();
    getWalletTransaction();
  }, [user?.id, setBalance]);

  return (
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
            <DepositCard type="deposit" />
          </TabsContent>

          <TabsContent value="withdraw">
            <DepositCard type="withdraw" />
          </TabsContent>
        </Tabs>

        <div className="space-y-4">
          <BalanceCard walletBalance={balance.walletBalance} bankBalance={balance.bankBalance} />
          <TransferHistory transactions={transactions} />
        </div>
      </div>
    </div>
  );
}

export default TransferForm;
