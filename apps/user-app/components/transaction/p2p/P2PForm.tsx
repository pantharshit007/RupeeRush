"use client";

import React, { useCallback, useEffect } from "react";

import Title from "@repo/ui/components/custom/Title";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@repo/ui/components/ui/tabs";
import { useBalanceState } from "@repo/store/balance";
import { useP2PTxn } from "@repo/store/p2pTransaction";

import BalanceCard from "@/components/transaction/BalanceCard";

import { useCurrentUser } from "@/hooks/UseCurrentUser";
import { getBalanceAction } from "@/actions/transaction/wallet/balance";
import { getP2PTransActions } from "@/actions/transaction/P2P/getP2PTransactions";
import P2PTransferCard from "@/components/transaction/p2p/P2PTransferCard";
import P2PTransferHistory from "@/components/transaction/p2p/P2PTranferHistory";
import { useTrigger } from "@repo/store/trigger";

function P2PForm() {
  const [balance, setBalance] = useBalanceState();
  const [transactions, setTransactions] = React.useState<any>([]);

  const user = useCurrentUser();
  const p2pTxnUpdated = useP2PTxn();
  const trigger = useTrigger();

  const fetchData = useCallback(async () => {
    if (!user?.id) return;

    const [balanceRes, transactionRes] = await Promise.all([
      getBalanceAction(user.id),
      getP2PTransActions(user.id),
    ]);
    setBalance(balanceRes);
    setTransactions(transactionRes);
  }, [user?.id, setBalance, p2pTxnUpdated.timestamp, trigger]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

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
          <BalanceCard walletBalance={balance.walletBalance} bankBalance={balance.bankBalance} />
          <P2PTransferHistory transactions={transactions} userId={user?.id!} />
        </div>
      </div>
    </div>
  );
}

export default P2PForm;
