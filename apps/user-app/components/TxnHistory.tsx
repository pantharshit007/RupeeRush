import Status from "@repo/ui/components/Status";
import React from "react";

interface TransactionType {
  time: Date;
  amount: number;
  status: "Success" | "Failure" | "Processing";
  provider: string;
}

function TxnHistory({ transaction }: { transaction: TransactionType }) {
  return (
    <>
      <div className="grid grid-cols-3">
        <div>
          <div className="text-sm">Received INR</div>
          <div className="text-slate-600 text-xs italic">{transaction.time.toDateString()}</div>
        </div>

        <div className="flex flex-col justify-center pl-14">+ Rs {transaction.amount / 100}</div>

        <div className="w-full my-auto pl-14">
          <Status status={transaction.status} />
        </div>
      </div>
    </>
  );
}

export default TxnHistory;
