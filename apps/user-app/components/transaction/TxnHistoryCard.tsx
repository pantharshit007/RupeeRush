import { Card, CardContent, CardHeader, CardTitle } from "@repo/ui/components/ui/card";

function TransactionHistory({ children }: { children: React.ReactNode }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-azureBlue-400 font-semibold">Recent Transactions</CardTitle>
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  );
}

export default TransactionHistory;
