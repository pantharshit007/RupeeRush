import { TableSkeleton } from "@/components/transaction/transactionTable/TableSkeleton";
import TransactionTable from "@/components/transaction/transactionTable/TransactionTable";
import Title from "@repo/ui/components/custom/Title";
import React, { Suspense } from "react";

function page({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const page = typeof searchParams.page === "string" ? parseInt(searchParams.page, 10) : 1;

  return (
    <>
      <Title title={"Transactions History"} />
      <Suspense fallback={<TableSkeleton />}>
        <TransactionTable initialPage={page} />
      </Suspense>
    </>
  );
}

export default page;
