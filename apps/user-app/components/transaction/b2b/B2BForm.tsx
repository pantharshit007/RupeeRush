"use client";

import React, { useCallback, useEffect } from "react";
import Title from "@repo/ui/components/custom/Title";
import { useBalanceState } from "@repo/store/balance";
import { useB2BTxn } from "@repo/store/b2bTransaction";
import BalanceCard from "@/components/transaction/BalanceCard";
import { useCurrentUser } from "@/hooks/UseCurrentUser";
import { getBalanceAction } from "@/actions/transaction/wallet/balance";
import { getB2BTransActions } from "@/actions/transaction/B2B/getB2BTransactions";
import B2BTransferCard from "@/components/transaction/b2b/B2BTransferCard";
import B2BTransferHistory from "@/components/transaction/b2b/B2BTransferHistory";
import { useTrigger } from "@repo/store/trigger";

function B2BForm() {
  const [balance, setBalance] = useBalanceState();
  const [transactions, setTransactions] = React.useState<any>([]);

  const user = useCurrentUser();
  const b2bTxnUpdated = useB2BTxn();
  const trigger = useTrigger();

  const fetchData = useCallback(async () => {
    if (!user?.id) return;

    const [balanceRes, transactionRes] = await Promise.all([
      getBalanceAction(user.id),
      getB2BTransActions(user.id),
    ]);
    setBalance(balanceRes);
    setTransactions(transactionRes);
  }, [user?.id, setBalance, b2bTxnUpdated.timestamp, trigger]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return (
    <div>
      <Title title={"Business to Business"} />

      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Left Side */}
        <B2BTransferCard />

        {/* Right Side */}
        <div className="space-y-4">
          <BalanceCard walletBalance={balance.walletBalance} bankBalance={balance.bankBalance} />
          <B2BTransferHistory transactions={transactions} userId={user?.id!} />
        </div>
      </div>
    </div>
  );
}

export default B2BForm;
