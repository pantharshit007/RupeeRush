import React from "react";

import { SchemaTypes } from "@repo/db/client";
import Status from "@repo/ui/components/custom/Status";
import TransactionHistory from "@/components/transaction/TxnHistoryCard";
import { formatDate } from "@/utils/data";
export interface TransactionType {
  startTime: Date | string;
  amount: number;
  status: SchemaTypes.TransactionStatus;
  provider: string;
  type: SchemaTypes.TransactionType;
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
                <p className="font-medium">{txn.type === "DEPOSIT" ? "Deposit" : "Withdraw"} INR</p>
                <p className="text-sm text-muted-foreground ">{formatDate(txn.startTime)}</p>
              </div>
              <div className="text-right">
                <p
                  className={`font-medium ${txn.type === "DEPOSIT" ? "text-emerald-400" : "text-rose-600"}`}
                >
                  {txn.type === "DEPOSIT" ? "+ " : "- "}₹ {txn.amount / 100}
                </p>
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
