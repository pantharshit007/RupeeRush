import React from "react";

import { SchemaTypes } from "@repo/db/client";
import Status from "@repo/ui/components/custom/Status";
import TransactionHistory from "@/components/TxnHistoryCard";
export interface TransactionType {
  time: Date;
  amount: number;
  status: SchemaTypes.TransactionStatus;
  provider: string;
  type: string;
}

function TransferHistory({ transactions }: { transactions: TransactionType[] }) {
  return (
    <TransactionHistory>
      {transactions.length === 0 ? (
        <p className="text-center py-4">No recent transactions</p>
      ) : (
        <ul className="space-y-3">
          {transactions.map((txn, index) => (
            <li
              key={index}
              className={`flex justify-between items-center ${txn.status === "FAILURE" && "text-destructive"}`}
            >
              <div>
                <p className="font-medium">Received INR</p>
                <p className="text-sm text-muted-foreground italic">{txn.time.toDateString()}</p>
              </div>
              <div className="text-right">
                <p className="font-medium">+ Rs {txn.amount / 100}</p>
                <Status status={txn.status} className="text-black/80" />
              </div>
            </li>
          ))}
        </ul>
      )}
    </TransactionHistory>
  );
}

export default TransferHistory;
