interface BalanceType {
  amount: number;
  locked: number;
}

function BalanceCard({ amount, locked }: BalanceType) {
  return (
    <div className="px-3 py-2 rounded-2xl bg-slate-200">
      <div className="flex justify-between border-b border-slate-400 pb-2 font-medium">
        <div>Unlocked balance</div>
        <div>{amount / 100} INR</div>
      </div>

      <div className="flex justify-between border-b border-slate-400 py-2 font-medium">
        <div>Total Locked Balance</div>
        <div>{locked / 100} INR</div>
      </div>

      <div className="flex justify-between pt-2 font-medium">
        <div>Total Balance</div>
        <div>{(locked + amount) / 100} INR</div>
      </div>
    </div>
  );
}

export default BalanceCard;
