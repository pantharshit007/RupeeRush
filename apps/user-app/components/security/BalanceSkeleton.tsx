import { Skeleton } from "@repo/ui/components/ui/skeleton";

const BalanceSecuritySkeleton = () => {
  return (
    <div className="space-y-4">
      {/* Wallet Balance Skeleton */}
      <div className="rounded-xl border bg-card text-card-foreground shadow animate-fade-in">
        <div className="flex flex-col space-y-1.5 p-6">
          <h3 className="tracking-tight text-sm font-medium text-muted-foreground">
            <Skeleton className="w-[50px] h-[20px]" />
          </h3>
        </div>
        <div className="p-6 pt-0">
          <div className="flex items-baseline space-x-2">
            <Skeleton className="w-[110px] h-[30px]" />
            <Skeleton className="w-[50px] h-[20px]" />
          </div>
        </div>
      </div>

      {/* Bank Balance Skeleton */}
      <div className="rounded-xl border bg-card text-card-foreground shadow animate-fade-in">
        <div className="flex flex-col space-y-1.5 p-6">
          <h3 className="tracking-tight text-sm font-medium text-muted-foreground">
            <Skeleton className="w-[50px] h-[20px]" />
          </h3>
        </div>
        <div className="p-6 pt-0">
          <div className="flex items-baseline space-x-2">
            <Skeleton className="w-[110px] h-[30px]" />
            <Skeleton className="w-[50px] h-[20px]" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default BalanceSecuritySkeleton;
