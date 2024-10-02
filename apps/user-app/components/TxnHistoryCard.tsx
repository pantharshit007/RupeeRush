import TxnHistory from "./TxnHistory";

interface TransactionType {
  time: Date;
  amount: number;
  status: "Success" | "Failure" | "Processing";
  provider: string;
}

function TransactionHistory({
  transactions,
}: {
  transactions: TransactionType[];
}) {
  return (
    <div className="px-3 py-2 rounded-2xl bg-slate-200 max-md:mb-5">
      {!transactions.length ? (
        <div className="text-center pb-8 pt-8">No Recent transactions</div>
      ) : (
        <div className="py-2">
          {transactions.map((txn, index) => (
            <TxnHistory transaction={txn} key={index} />
          ))}
        </div>
      )}
    </div>
  );
}

export default TransactionHistory;
