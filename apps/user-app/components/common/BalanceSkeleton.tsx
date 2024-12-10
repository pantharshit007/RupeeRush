import { Skeleton } from "@repo/ui/components/ui/skeleton";

const BalanceSkeleton = () => {
  return (
    <>
      <div className="p-6 pt-0 space-y-2">
        <div className="flex justify-between">
          <Skeleton className="h-6 w-2/5" /> {/* Skeleton for "Wallet balance" */}
          <Skeleton className="h-5 w-24" /> {/* Skeleton for the "2000 INR" balance */}
        </div>
        <div className="flex justify-between">
          <Skeleton className="h-6 w-2/5" /> {/* Skeleton for "Bank Balance" */}
          <Skeleton className="h-5 w-24" /> {/* Skeleton for the "10000 INR" balance */}
        </div>
        <div className="flex justify-between font-semibold">
          <Skeleton className="h-6 w-2/5" /> {/* Skeleton for "Total Balance" */}
          <Skeleton className="h-5 w-24" /> {/* Skeleton for the "12000 INR" balance */}
        </div>
      </div>
    </>
  );
};

export default BalanceSkeleton;
