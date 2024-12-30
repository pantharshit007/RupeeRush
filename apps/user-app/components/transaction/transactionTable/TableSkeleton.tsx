import { Skeleton } from "@repo/ui/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@repo/ui/components/ui/table";
import {
  Collapsible,
  CollapsibleTrigger,
  CollapsibleContent,
} from "@repo/ui/components/ui/collapsible";

export function TableSkeleton() {
  return (
    <div className="container mx-auto py-10 px-4">
      {/* Desktop skeleton */}
      <div className="hidden md:block">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[150px]">
                <Skeleton className="h-4 w-full" />
              </TableHead>
              <TableHead className="w-[200px]">
                <Skeleton className="h-4 w-full" />
              </TableHead>
              <TableHead>
                <Skeleton className="h-4 w-full" />
              </TableHead>
              <TableHead>
                <Skeleton className="h-4 w-full" />
              </TableHead>
              <TableHead>
                <Skeleton className="h-4 w-full" />
              </TableHead>
              <TableHead>
                <Skeleton className="h-4 w-full" />
              </TableHead>
              <TableHead>
                <Skeleton className="h-4 w-full" />
              </TableHead>
              <TableHead>
                <Skeleton className="h-4 w-full" />
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {[...Array(5)].map((_, i) => (
              <TableRow key={i}>
                <TableCell>
                  <Skeleton className="h-4 w-full" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-4 w-full" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-4 w-full" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-4 w-full" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-4 w-full" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-4 w-full" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-4 w-full" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-4 w-full" />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Mobile skeleton */}
      <div className="md:hidden">
        {[...Array(5)].map((_, i) => (
          <Collapsible key={i} className="mb-4 border rounded-lg">
            <CollapsibleTrigger className="flex justify-between items-center w-full p-4 text-left">
              <div>
                <Skeleton className="h-4 w-32 mb-1" />
                <Skeleton className="h-4 w-24" />
              </div>
              <Skeleton className="h-5 w-5" />
            </CollapsibleTrigger>
            <CollapsibleContent className="p-4 border-t">
              <div className="grid grid-cols-2 gap-2 text-sm">
                <p className="font-semibold">
                  <Skeleton className="h-4 w-20" />
                </p>
                <p>
                  <Skeleton className="h-4 w-full" />
                </p>
                <p className="font-semibold">
                  <Skeleton className="h-4 w-20" />
                </p>
                <p>
                  <Skeleton className="h-4 w-full" />
                </p>
                <p className="font-semibold">
                  <Skeleton className="h-4 w-20" />
                </p>
                <p>
                  <Skeleton className="h-4 w-full" />
                </p>
                <p className="font-semibold">
                  <Skeleton className="h-4 w-28" />
                </p>
                <p>
                  <Skeleton className="h-4 w-full" />
                </p>
                <p className="font-semibold">
                  <Skeleton className="h-4 w-28" />
                </p>
                <p>
                  <Skeleton className="h-4 w-full" />
                </p>
              </div>
              <Skeleton className="h-4 w-20 mt-2" />
            </CollapsibleContent>
          </Collapsible>
        ))}
      </div>
    </div>
  );
}
