// "use client";
import { Card, CardContent, CardHeader, CardTitle } from "@repo/ui/components/ui/card";

interface BalanceType {
  walletBalance: number;
  bankBalance: number;
}

function BalanceCard({ walletBalance, bankBalance }: BalanceType) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-azureBlue-400 font-semibold">Balance</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        <div className="flex justify-between">
          <span>Wallet balance</span>
          <span className="text-emerald-500 font-medium">{walletBalance / 100} INR</span>
        </div>
        <div className="flex justify-between">
          <span>Bank Balance</span>
          <span className="text-azureBlue-400 font-medium">{bankBalance / 100} INR</span>
        </div>
        <div className="flex justify-between font-bold">
          <span>Total Balance</span>
          <span>{(bankBalance + walletBalance) / 100} INR</span>
        </div>
      </CardContent>
    </Card>
  );
}

export default BalanceCard;
