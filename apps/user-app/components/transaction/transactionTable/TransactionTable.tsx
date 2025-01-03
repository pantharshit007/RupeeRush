"use client";

import { useState, useMemo, useTransition, useEffect, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { format } from "date-fns";
import {
  ChevronDown,
  ChevronUp,
  ChevronRight,
  ChevronLeft,
  ChevronsLeft,
  ChevronsRight,
  MoveRight,
} from "lucide-react";
import { Transaction, TransactionStatus, TransactionType } from "@repo/schema/types";
import { Button } from "@repo/ui/components/ui/button";
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
  CollapsibleContent,
  CollapsibleTrigger,
} from "@repo/ui/components/ui/collapsible";

import { TransactionDetailsDialog } from "@/components/transaction/transactionTable/TransactionDetail";
import { TableSkeleton } from "@/components/transaction/transactionTable/TableSkeleton";
import { getAllTransactionAction } from "@/actions/getAllTransaction";
import { useCurrentUser } from "@/hooks/UseCurrentUser";
import { toast } from "sonner";
import UserAvatar from "@/components/common/UserAvatar";

const ITEMS_PER_PAGE = 10;

export default function TransactionTable({ initialPage = 1 }: { initialPage: number }) {
  const [isPending, startTransition] = useTransition();

  const [transactions, setTransactions] = useState<Transaction[] | null>(null);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [totalPages, setTotalPages] = useState(0);

  const router = useRouter();
  const searchParams = useSearchParams();
  const user = useCurrentUser();

  useMemo(() => {
    return transactions?.sort((a, b) => {
      return sortOrder === "asc"
        ? a.date.getTime() - b.date.getTime()
        : b.date.getTime() - a.date.getTime();
    });
  }, [transactions, sortOrder]);

  const handleSort = () => {
    setSortOrder(sortOrder === "asc" ? "desc" : "asc");
  };

  const handleViewDetails = (transaction: Transaction) => {
    setSelectedTransaction(transaction);
    setIsDialogOpen(true);
  };

  const getStatusColor = (status: TransactionStatus) => {
    switch (status) {
      case TransactionStatus.SUCCESS:
        return "text-green-600 bg-green-200";
      case TransactionStatus.FAILURE:
        return "text-red-600 bg-red-200";
      case TransactionStatus.PROCESSING:
        return "text-yellow-600 bg-yellow-100";
      default:
        return "text-gray-600 bg-gray-200";
    }
  };

  const handlePageChange = (page: number) => {
    startTransition(() => {
      router.push(`/dashboard/transactions?page=${page}`);
      setCurrentPage(page);
    });
  };

  const formatAmount = (amount: number, type: TransactionType): string => {
    const value =
      type === "RECEIVE" || type === "DEPOSIT"
        ? `+ ₹${(amount / 100).toLocaleString()}`
        : `- ₹${(amount / 100).toLocaleString()}`;

    return value;
  };

  // Fetch action call
  const fetchTransactions = useCallback(async () => {
    const page = searchParams.get("page");
    if (page) {
      setCurrentPage(parseInt(page, 10));
    }

    startTransition(async () => {
      const res = await getAllTransactionAction(user?.id!, currentPage, ITEMS_PER_PAGE);
      if (!res.success) {
        toast.error(res.error || "Error fetching transactions");
        return;
      }

      setTransactions(res.data!);
      setTotalPages(Math.ceil(res.totalCount! / ITEMS_PER_PAGE));
    });
  }, [searchParams, user?.id]);

  useEffect(() => {
    fetchTransactions();
    const page = searchParams.get("page");

    if (page) {
      setCurrentPage(parseInt(page, 10));
    }
  }, [searchParams]);

  if (isPending) {
    return <TableSkeleton />;
  }

  return (
    <div className="container mx-auto py-10 px-4">
      {!transactions ? (
        <div className="flex flex-col items-center justify-center">
          <h2 className="text-2xl font-bold">No transactions found</h2>
          <p className="text-gray-500">Perform a deposit or withdrawal to see transactions!</p>
        </div>
      ) : (
        <>
          {/* Desktop view */}
          <div className="hidden md:block">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Recipient / Sender</TableHead>
                  <TableHead className="w-[150px]">Transaction ID</TableHead>
                  <TableHead className="w-[150px] cursor-pointer" onClick={handleSort}>
                    Date{" "}
                    {sortOrder === "asc" ? (
                      <ChevronUp className="inline" />
                    ) : (
                      <ChevronDown className="inline" />
                    )}
                  </TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Transaction Type</TableHead>
                  <TableHead>Status</TableHead>
                  {/* <TableHead>Transfer Method</TableHead> */}
                  <TableHead>Details</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {transactions.map((transaction) => (
                  <TableRow key={transaction.id}>
                    <TableCell className="uppercase">
                      <div className="flex gap-x-4 items-start">
                        <UserAvatar
                          className="h-8 w-8 rounded-lg border-none"
                          customName={transaction.recipientOrSender}
                        />
                        <span className="pt-[5px]">{transaction.recipientOrSender || "N/A"}</span>
                      </div>
                    </TableCell>
                    <TableCell className="font-medium">
                      TXN{transaction.id.split("-")[0]?.toUpperCase()}
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col items-start">
                        {format(transaction.date, "MMM dd, yyyy")}
                        <span className="text-xs text-gray-500">
                          {format(transaction.date, "hh:mm a")}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell
                      className={`${transaction.type === "RECEIVE" || transaction.type === "DEPOSIT" ? "text-emerald-400" : "text-rose-600"}`}
                    >
                      {formatAmount(transaction.amount, transaction.type)}
                    </TableCell>
                    <TableCell>{transaction.type}</TableCell>
                    <TableCell>
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-semibold ${getStatusColor(transaction.status)}`}
                      >
                        {transaction.status}
                      </span>
                    </TableCell>
                    {/* <TableCell>{transaction.transferMethod || "N/A"}</TableCell> */}
                    <TableCell className="group">
                      <Button
                        className="-px-3 min-w-[120px]"
                        variant="link"
                        onClick={() => handleViewDetails(transaction)}
                      >
                        View Details
                        <MoveRight className="ml-2 group-hover:scale-x-125 transition-transform duration-300" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {/* Mobile view */}
          <div className="md:hidden">
            <div className="flex justify-between items-center mb-4">
              <Button variant="outline" size="sm" onClick={handleSort}>
                Sort by Date{" "}
                {sortOrder === "asc" ? (
                  <ChevronUp className="ml-2" />
                ) : (
                  <ChevronDown className="ml-2" />
                )}
              </Button>
            </div>
            {transactions.map((transaction) => (
              <Collapsible key={transaction.id} className="mb-4 border rounded-lg">
                <CollapsibleTrigger className="flex justify-between items-center w-full p-4 text-left">
                  <div>
                    <p className="font-semibold">
                      TXN{transaction.id.split("-")[0]?.toUpperCase()}
                    </p>
                    <p className="text-sm text-gray-500">
                      {format(transaction.date, "MMM dd, yyyy, hh:mm a")}
                    </p>
                  </div>
                  <ChevronRight className="h-5 w-5" />
                </CollapsibleTrigger>
                <CollapsibleContent className="p-4 border-t">
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <p className="font-semibold">Amount:</p>
                    <p
                      className={`${transaction.type === "RECEIVE" || transaction.type === "DEPOSIT" ? "text-emerald-400" : "text-rose-600"}`}
                    >
                      ₹{(transaction.amount / 100).toLocaleString()}
                    </p>
                    <p className="font-semibold">Type:</p>
                    <p>{transaction.type}</p>
                    <p className="font-semibold">Status:</p>
                    <p>
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-semibold ${getStatusColor(transaction.status)}`}
                      >
                        {transaction.status}
                      </span>
                    </p>
                    <p className="font-semibold">Recipient / Sender:</p>
                    <p className="uppercase">{transaction.recipientOrSender || "N/A"}</p>
                    <p className="font-semibold">Transfer Method:</p>
                    <p>{transaction.transferMethod || "N/A"}</p>
                  </div>
                  <Button
                    variant="link"
                    onClick={() => handleViewDetails(transaction)}
                    className="mt-2 -px-3 group min-w-[120px]"
                  >
                    View Details
                    <MoveRight className="ml-2 group-hover:scale-x-125 transition-transform duration-300" />
                  </Button>
                </CollapsibleContent>
              </Collapsible>
            ))}
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between mt-4">
            <Button
              variant="outline"
              onClick={() => handlePageChange(1)}
              disabled={currentPage === 1 || isPending}
            >
              <ChevronsLeft className="h-4 w-4" />
            </Button>

            <Button
              variant="outline"
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1 || isPending}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>

            <span>
              Page {currentPage} of {totalPages}
            </span>

            <Button
              variant="outline"
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages || isPending}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              onClick={() => handlePageChange(totalPages)}
              disabled={currentPage === totalPages || isPending}
            >
              <ChevronsRight className="h-4 w-4" />
            </Button>
          </div>

          <TransactionDetailsDialog
            transaction={selectedTransaction}
            open={isDialogOpen}
            onOpenChange={setIsDialogOpen}
          />
        </>
      )}
    </div>
  );
}
