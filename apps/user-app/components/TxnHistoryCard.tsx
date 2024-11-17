import { SchemaTypes } from "@repo/db/client";
import TxnHistory from "./TxnHistory";
import { Card, CardContent, CardHeader, CardTitle } from "@repo/ui/components/ui/card";
import Status from "@repo/ui/components/custom/Status";

export interface TransactionType {
  time: Date;
  amount: number;
  status: SchemaTypes.TransactionStatus;
  provider: string;
}

function TransactionHistory({ transactions }: { transactions: TransactionType[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-azureBlue-400 font-semibold">Recent Transactions</CardTitle>
      </CardHeader>
      <CardContent>
        {transactions.length === 0 ? (
          <p className="text-center py-4">No recent transactions</p>
        ) : (
          <ul className="space-y-3">
            {transactions.map((txn, index) => (
              <li key={index} className="flex justify-between items-center">
                <div>
                  <p className="font-medium">Received INR</p>
                  <p className="text-sm text-muted-foreground italic">{txn.time.toDateString()}</p>
                </div>
                <div className="text-right">
                  <p className="font-medium">+ Rs {txn.amount / 100}</p>
                  <Status status={txn.status} />
                </div>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>

    // <div className="px-3 py-2 rounded-2xl bg-slate-200 max-md:mb-5">
    //   {!transactions.length ? (
    //     <div className="text-center pb-8 pt-8">No Recent transactions</div>
    //   ) : (
    //     <div className="py-2 flex flex-col gap-y-2">
    //       {transactions.map((txn, index) => (
    //         <TxnHistory transaction={txn} key={index} />
    //       ))}
    //     </div>
    //   )}
    // </div>
  );
}

export default TransactionHistory;
