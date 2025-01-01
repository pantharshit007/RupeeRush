import { Skeleton } from "@repo/ui/components/ui/skeleton";

const CreditCardSkeleton = () => {
  return (
    <div className="flex flex-col items-center justify-center order-1 lg:order-2">
      <div className="space-y-6">
        {/* Card Skeleton */}
        <div className="relative w-96 max-md:w-76 max-sm:w-[21rem] max-w-full h-56 cursor-pointer perspective-1000">
          <div className="relative w-full h-full transition-all duration-500 preserve-3d ease-linear">
            <div className="absolute w-full h-full backface-hidden">
              <div className="w-full h-full rounded-2xl bg-gradient-to-br from-azureBlue-500 via-azureBlue-300 to-azureBlue-700 text-white shadow-xl p-6">
                <div className="flex justify-between items-center">
                  <Skeleton className="w-10 h-10 bg-azureBlue-500" /> {/* Skeleton for the Chip */}
                  <Skeleton className="h-6 w-3/5 bg-azureBlue-500" /> {/* Skeleton for the text */}
                </div>
                <div className="mt-8">
                  {/* Skeleton for the card number */}
                  <Skeleton className="text-2xl max-sm:text-xl tracking-wider h-6 w-3/4 bg-azureBlue-500" />{" "}
                </div>
                <div className="mt-8 flex justify-between">
                  <div className="space-y-1">
                    <div className="text-xs opacity-75">
                      <Skeleton className="h-4 w-16 bg-azureBlue-500" />{" "}
                      {/* Skeleton for "Card Holder" */}
                    </div>
                    <div className="text-sm font-medium">
                      <Skeleton className="h-5 w-24 bg-azureBlue-500" />{" "}
                      {/* Skeleton for "name:Alice" */}
                    </div>
                  </div>
                  <div className="space-y-1">
                    <div className="text-xs opacity-75">
                      <Skeleton className="h-4 w-16 bg-azureBlue-500" />{" "}
                      {/* Skeleton for "Expires" */}
                    </div>
                    <div className="text-sm font-medium">
                      <Skeleton className="h-5 w-20 bg-azureBlue-500" />{" "}
                      {/* Skeleton for "12/2026" */}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreditCardSkeleton;
