import React from "react";
import { SchemaTypes } from "@repo/db/client";
import Status from "@repo/ui/components/custom/Status";
import TransactionHistory from "@/components/transaction/TxnHistoryCard";
import { cn } from "@repo/ui/lib/utils";
import { formatDate } from "@/utils/data";

export interface P2PTransactionType {
  id: string;
  amount: number;
  timestamp: Date | string;
  status: SchemaTypes.TransactionStatus;
  senderIdentifier: string;
  receiverIdentifier: string;
  senderUserId: string;
  receiverUserId: string;
  transferMethod: SchemaTypes.TransferMethod;
  type: SchemaTypes.TransactionType;
}

function P2PTransferHistory({
  transactions,
  userId,
}: {
  transactions: P2PTransactionType[];
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
        <p className="text-center py-4">No recent P2P transactions</p>
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
                  {txn.transferMethod === "PHONE" ? "Via Phone" : "Via UPI"} -
                  {txn.type === "TRANSFER"
                    ? ` To ${txn.receiverIdentifier}`
                    : ` From ${txn.senderIdentifier}`}
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

export default P2PTransferHistory;
