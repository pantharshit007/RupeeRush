"use client";
import React, { useCallback, useEffect } from "react";

import Title from "@repo/ui/components/custom/Title";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@repo/ui/components/ui/tabs";
import { useBalanceState } from "@repo/store/balance";
import { useTrigger } from "@repo/store/trigger";

import BalanceCard from "@/components/transaction/BalanceCard";
import WalletTransferCard from "@/components/transaction/transfer/WalletTransferCard";
import { getBalanceAction } from "@/actions/transaction/wallet/balance";
import { useCurrentUser } from "@/hooks/UseCurrentUser";
import { getOnRampTxnAction } from "@/actions/transaction/wallet/onRampTransaction";
import TransferHistory from "./TransferHistory";

function WalletForm() {
  // TODO: remove this damn balance atom state
  const [balance, setBalance] = useBalanceState();
  const [transactions, setTransactions] = React.useState<any>([]);
  const user = useCurrentUser();
  const trigger = useTrigger();

  const fetchData = useCallback(async () => {
    if (!user?.id) return;

    try {
      const [balanceRes, transactionRes] = await Promise.all([
        getBalanceAction(user.id),
        getOnRampTxnAction(user.id),
      ]);

      setBalance(balanceRes);
      setTransactions(transactionRes);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }, [user?.id, setBalance, trigger]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return (
    <div className="">
      <Title title={"Wallet Transfer"} />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
        <Tabs defaultValue="deposit" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger
              value="deposit"
              className=" data-[state=active]:text-sky-500 data-[state=active]:font-bold"
            >
              Deposit
            </TabsTrigger>
            <TabsTrigger
              value="withdraw"
              className="data-[state=active]:text-sky-500 data-[state=active]:font-bold"
            >
              Withdraw
            </TabsTrigger>
          </TabsList>

          <TabsContent value="deposit">
            <WalletTransferCard type="deposit" />
          </TabsContent>

          <TabsContent value="withdraw">
            <WalletTransferCard type="withdraw" />
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

export default WalletForm;
