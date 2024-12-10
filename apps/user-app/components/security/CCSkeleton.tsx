import { Skeleton } from "@repo/ui/components/ui/skeleton";

const CreditCardSkeleton = () => {
  return (
    <div className="flex flex-col items-center justify-center order-1 lg:order-2">
      <div className="space-y-6">
        {/* Card Skeleton */}
        <div className="relative w-96 max-md:w-76 max-sm:w-[21rem] max-w-full h-56 cursor-pointer perspective-1000">
          <div className="relative w-full h-full transition-all duration-500 preserve-3d ease-linear">
            <div className="absolute w-full h-full backface-hidden">
              <div className="w-full h-full rounded-xl p-6 bg-gradient-to-br from-azureBlue-400 to-azureBlue-500 text-white shadow-lg">
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

        {/* Card Details Button Skeleton */}
        <div className="rounded-xl border bg-card text-card-foreground shadow w-full max-w-md">
          <div className="p-0">
            <button className="whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 dark:text-white hover:bg-accent hover:text-accent-foreground h-10 w-full flex justify-between items-center p-4">
              <Skeleton className="h-4 w-1/4 " /> {/* Skeleton for button text */}
              <Skeleton className="w-4 h-4" /> {/* Skeleton for the Chevron icon */}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreditCardSkeleton;
