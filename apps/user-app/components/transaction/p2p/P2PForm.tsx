"use client";

import React, { useEffect } from "react";

import Title from "@repo/ui/components/custom/Title";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@repo/ui/components/ui/tabs";

import BalanceCard from "@/components/transaction/BalanceCard";
import TransferHistory from "@/components/transaction/transfer/TransferHistory";
import { useBalanceState } from "@repo/store/balance";

import { useCurrentUser } from "@/hooks/UseCurrentUser";
import { getBalanceAction } from "@/actions/transaction/wallet/balance";
import { getP2PTransactions } from "@/actions/transaction/P2P/getP2PTransactions";
import P2PTransferCard from "@/components/transaction/p2p/P2PTransferCard";

function P2PForm() {
  const [balance, setBalance] = useBalanceState();
  const [transactions, setTransactions] = React.useState<any>([]);
  const user = useCurrentUser();

  useEffect(() => {
    if (user?.id) {
      const fetchBalance = async () => {
        const balanceRes = await getBalanceAction(user.id);
        setBalance(balanceRes);
      };
      fetchBalance();
    }
    return () => {};
  }, [user?.id, setBalance]);

  useEffect(() => {
    if (user?.id && balance.walletBalance) {
      const fetchTransactions = async () => {
        //   TODO: change this action to: getP2PTransactionsAction
        const transactionRes = await getP2PTransactions(user.id);
        setTransactions(transactionRes);
      };
      fetchTransactions();
    }
    return () => {};
  }, [user?.id, balance.walletBalance, setTransactions]);

  return (
    <div>
      <Title title={"Peer to Peer"} />

      <div className=" mt-8 grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Left Side */}
        <Tabs defaultValue="phone" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger
              value="phone"
              className="data-[state=active]:text-sky-500 data-[state=active]:font-bold"
            >
              Phone Number
            </TabsTrigger>
            <TabsTrigger
              value="upi"
              className="data-[state=active]:text-sky-500 data-[state=active]:font-bold"
            >
              UPI ID
            </TabsTrigger>
          </TabsList>

          <TabsContent value="phone">
            <P2PTransferCard type="phone" />
          </TabsContent>

          <TabsContent value="upi">
            <P2PTransferCard type="upi" />
          </TabsContent>
        </Tabs>

        {/* Right Side */}
        <div className="space-y-4">
          <BalanceCard
            walletBalance={balance.walletBalance ?? 0}
            bankBalance={balance.bankBalance ?? 0}
          />
          <TransferHistory transactions={transactions} />
        </div>
      </div>
    </div>
  );
}

export default P2PForm;
