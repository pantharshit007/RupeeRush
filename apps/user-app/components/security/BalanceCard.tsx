import { Card, CardContent, CardHeader, CardTitle } from "@repo/ui/components/ui/card";

interface BalanceCardProps {
  title: string;
  amount: number;
  currency?: string;
  trend?: number;
}

export const BalanceCard = ({ title, amount, currency = "USD", trend }: BalanceCardProps) => {
  const formattedAmount =
    amount !== undefined ? amount.toLocaleString("en-US", { style: "currency", currency }) : "N/A";

  return (
    <Card className="animate-fade-in">
      <CardHeader>
        <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-baseline space-x-2">
          <span className="text-2xl font-bold">{formattedAmount}</span>
          {trend !== undefined && (
            <span className={`text-sm ${trend > 0 ? "text-green-500" : "text-red-500"}`}>
              {trend > 0 ? "+" : ""}
              {trend}%
            </span>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
