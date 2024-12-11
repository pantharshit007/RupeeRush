import React from "react";
import { SchemaTypes } from "@repo/db/client";
import Status from "@repo/ui/components/custom/Status";
import TransactionHistory from "@/components/transaction/TxnHistoryCard";
import { cn } from "@repo/ui/lib/utils";
import { formatDate } from "@/utils/data";

export interface B2BTransactionType {
  id: string;
  amount: number;
  timestamp: Date | string;
  status: SchemaTypes.TransactionStatus;
  type: SchemaTypes.TransactionType;
  senderAccountNumber: string;
  receiverAccountNumber: string;
  senderBankName: string;
  receiverBankName: string;
  senderUserId: string;
  receiverUserId: string;
}

function B2BTransferHistory({
  transactions,
  userId,
}: {
  transactions: B2BTransactionType[];
  userId: string;
}) {
  // transform transactions array if receiverUserId is equal to userId
  transactions = transactions.map((txn) => {
    if (txn.receiverUserId === userId) {
      txn.type = "RECEIVE";
    }
    return txn;
  });

  return (
    <TransactionHistory>
      {transactions.length === 0 ? (
        <p className="text-center py-4">No recent B2B transactions</p>
      ) : (
        <ul className="space-y-3">
          {transactions.map((txn) => (
            <li
              key={txn.id}
              className={`flex justify-between items-center ${txn.status === "FAILURE" && "text-rose-600"}`}
            >
              <div>
                <p className="font-medium">
                  {txn.type === "TRANSFER" ? "Transfer" : "Receive"} INR
                </p>

                <p className="text-xs text-muted-foreground">
                  {txn.type === "TRANSFER"
                    ? `To ${txn.receiverAccountNumber} (${txn.receiverBankName})`
                    : `From ${txn.senderAccountNumber} (${txn.senderBankName})`}
                </p>

                <p className="text-xs text-muted-foreground">{formatDate(txn.timestamp)}</p>
              </div>

              <div className="text-right">
                <p
                  className={cn(
                    "font-medium",
                    txn.type === "RECEIVE" ? "text-emerald-400" : "text-rose-600",
                    txn.status === "FAILURE" && "text-rose-600"
                  )}
                >
                  {txn.type === "RECEIVE" ? "+ " : "- "}₹ {txn.amount / 100}
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

export default B2BTransferHistory;
