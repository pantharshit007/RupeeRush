import { Card, CardContent, CardHeader, CardTitle } from "@repo/ui/components/ui/card";

interface BalanceType {
  amount: number;
  locked: number;
}

function BalanceCard({ amount, locked }: BalanceType) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-azureBlue-400 font-semibold">Balance</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        <div className="flex justify-between">
          <span>Current balance</span>
          <span className="text-emerald-500 font-medium">{amount / 100} INR</span>
        </div>
        <div className="flex justify-between">
          <span>Locked Balance</span>
          <span>{locked / 100} INR</span>
        </div>
        <div className="flex justify-between font-bold">
          <span>Total Balance</span>
          <span>{(locked + amount) / 100} INR</span>
        </div>
      </CardContent>
    </Card>
  );
}

export default BalanceCard;
