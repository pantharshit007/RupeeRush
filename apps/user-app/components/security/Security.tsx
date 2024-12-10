"use client";

import React, { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { useBalanceState } from "@repo/store/balance";

import { CreditCard, CreditCardProps } from "@/components/security/CreditCard";
import { BalanceCard } from "@/components/security/BalanceCard";
import Title from "@repo/ui/components/custom/Title";
import { QuickActions } from "@/components/common/QuickActions";
import { useCurrentUser } from "@/hooks/UseCurrentUser";
import { getBalanceAction } from "@/actions/transaction/wallet/balance";
import { getCreditCardAction } from "@/actions/getCreditCard";
import BalanceSecuritySkeleton from "@/components/security/BalanceSkeleton";
import CreditCardSkeleton from "@/components/security/CCSkeleton";

function Security() {
  const [cardDetails, setCardDetails] = useState<CreditCardProps | null>(null);
  const [balance, setBalance] = useBalanceState();
  const route = useRouter();
  const user = useCurrentUser();

  const fetchData = useCallback(async () => {
    if (!user?.id) return;

    const [balanceRes, transactionRes] = await Promise.all([
      getBalanceAction(user.id),
      getCreditCardAction(user.id),
    ]);

    setBalance(balanceRes);
    setCardDetails(transactionRes);
  }, [user?.id, setBalance]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const onClickSend = () => {
    route.push("/dashboard/p2p-transfer");
  };

  const onClickAdd = () => {
    route.push("/dashboard/wallet-transfer");
  };

  return (
    <>
      <div className="">
        <>
          <Title title={"Payment Dashboard"} />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-8">
            {/* Left Column - Balances */}
            <div className="space-y-6 order-2 lg:order-1">
              {!balance.bankBalance && !balance.walletBalance ? (
                <BalanceSecuritySkeleton />
              ) : (
                <>
                  <BalanceCard title="Wallet Balance" amount={balance.walletBalance!} trend={2.5} />
                  <BalanceCard title="Bank Balance" amount={balance.bankBalance!} trend={-0.8} />
                </>
              )}

              {/* Quick Actions */}
              <QuickActions onClickSend={onClickSend} onClickAdd={onClickAdd} />
            </div>

            {/* Right Column - Credit Card */}
            <div className="flex flex-col items-center justify-center order-1 lg:order-2">
              {!cardDetails ? (
                <CreditCardSkeleton />
              ) : (
                <CreditCard
                  cardNumber={cardDetails.cardNumber}
                  cardHolder={cardDetails.cardHolder}
                  cardExpiry={cardDetails.cardExpiry}
                  cardCvv={cardDetails.cardCvv}
                />
              )}
            </div>
          </div>
        </>
      </div>
    </>
  );
}

export default Security;
