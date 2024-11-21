import { SchemaTypes } from "@repo/db/client";
import Status from "@repo/ui/components/custom/Status";
import React from "react";

interface TransactionType {
  startTime: Date | string;
  amount: number;
  status: SchemaTypes.TransactionStatus;
  provider: string;
}

function TxnHistory({ transaction }: { transaction: TransactionType }) {
  return (
    <>
      <div className="grid grid-cols-3">
        <div>
          <div className="text-sm">Received INR</div>
          <div className="text-slate-600 text-xs italic">
            {new Date(transaction.startTime).toDateString()}
          </div>
        </div>

        <div className="flex flex-col justify-center pl-14">+ Rs {transaction.amount / 100}</div>

        <div className="w-full my-auto pl-14">
          <Status status={transaction.status as SchemaTypes.TransactionStatus} />
        </div>
      </div>
    </>
  );
}

export default TxnHistory;
