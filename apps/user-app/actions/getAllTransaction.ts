"use server";

import { auth } from "@/lib/auth";
import { cache, cacheType } from "@repo/db/cache";
import db, { Prisma } from "@repo/db/client";
import { TransactionStatus, TransactionType } from "@repo/schema/types";

interface TransactionResponse {
  id: string;
  date: Date;
  amount: number;
  type: TransactionType;
  status: TransactionStatus;
  recipientOrSender: string;
  details: Details;
}

interface TransactionsHistoryResponse {
  success: boolean;
  data?: TransactionResponse[];
  totalCount?: number;
  hasMore?: boolean;
  error?: string;
}

interface TransactionCache {
  data: TransactionResponse[];
  totalCount: number;
  hasMore: boolean;
}

interface Details {
  provider?: string;
  transferMethod?: string;
  senderIdentifier?: string;
  receiverIdentifier?: string;
  senderBank?: string;
  receiverBank?: string;
  senderAccount?: string;
  receiverAccount?: string;
}

/**
 * Fetch all transactions for a user: Wallet, P2P, B2B
 * @param userId
 * @param page?=1
 * @param pageSize?=10
 */
async function getAllTransactionAction(
  userId: string,
  page: number = 1,
  pageSize: number = 10
): Promise<TransactionsHistoryResponse> {
  const session = await auth();

  try {
    if (!session || !session?.user || session.user.id !== userId) {
      return { success: false, error: "Unauthorized" };
    }

    const offset = (page - 1) * pageSize;

    // caching transactions for 2 hours and evicting if there is a new transaction
    const cachedTransactions: TransactionCache | null = await cache.get(
      cacheType.TRANSACTION_PAGE,
      [userId, "page", page.toString()]
    );

    if (cachedTransactions) {
      const processedData = cachedTransactions.data.map((txn) => ({
        ...txn,
        date: new Date(txn.date),
      }));

      return {
        success: true,
        data: processedData,
        totalCount: cachedTransactions.totalCount || 0,
        hasMore: cachedTransactions.hasMore || false,
      };
    }

    // Fetch transactions: SQL query
    const txnRawQuery = Prisma.sql`
      SELECT id, date, amount, status::text as status, type::text as type, "recipientOrSender"::text, details::jsonb 
      FROM (
        -- OnRamp Transactions
        SELECT id, amount,  status, "startTime" AS date, type, provider::text AS "recipientOrSender",
          JSONB_BUILD_OBJECT('provider', provider::text)::jsonb AS details
        FROM "OnRampTransaction"

        WHERE "userId" = ${userId}
      
        UNION ALL
      
        -- P2P Transactions
        SELECT id, amount, status, "timestamp" AS date,
          CASE
            WHEN "receiverUserId" = ${userId} THEN 'RECEIVE'::"TransactionType"
            ELSE type
          END AS type,
          
          CASE
            WHEN "receiverUserId" = ${userId} THEN COALESCE("senderUser"."name", "senderIdentifier")
            ELSE COALESCE("receiverUser"."name", "receiverIdentifier")
          END AS "recipientOrSender",

          JSONB_BUILD_OBJECT(
            'transferMethod', "transferMethod",
            'senderIdentifier', "senderIdentifier",
            'receiverIdentifier', "receiverIdentifier"
          ) AS details
        FROM "P2pTransaction"

        LEFT JOIN 
          ( SELECT id AS user_id, name FROM "User")
         AS "senderUser" ON "senderUserId" = "senderUser"."user_id"
        LEFT JOIN 
          ( SELECT id AS user_id, name FROM "User")
         AS "receiverUser" ON "receiverUserId" = "receiverUser"."user_id"

        WHERE "senderUserId" = ${userId} OR "receiverUserId" = ${userId}
             
        UNION ALL

        -- B2B Transactions
        SELECT id, amount, status, "timestamp" AS date,
          CASE
            WHEN "receiverUserId" = ${userId} THEN 'RECEIVE'::"TransactionType"
            ELSE type
          END AS type,

          CASE
            WHEN "receiverUserId" = ${userId} THEN COALESCE("senderUser"."name", "senderAccountNumber")
            ELSE COALESCE("receiverUser"."name", "receiverAccountNumber")
          END AS "recipientOrSender",

          JSONB_BUILD_OBJECT(
            'senderBank', "senderBankName",
            'receiverBank', "receiverBankName",
            'senderAccount', "senderAccountNumber",
            'receiverAccount', "receiverAccountNumber"
          ) AS details
        FROM "B2bTransaction"

        LEFT JOIN 
          ( SELECT id AS user_id, name FROM "User")
         AS "senderUser" ON "senderUserId" = "senderUser"."user_id"
        LEFT JOIN 
          ( SELECT id AS user_id, name FROM "User")
         AS "receiverUser" ON "receiverUserId" = "receiverUser"."user_id"

        WHERE "senderUserId" = ${userId} OR "receiverUserId" = ${userId}
      ) AS combinedTransactions
    
      ORDER BY date DESC
      LIMIT ${pageSize} OFFSET ${offset};
`;

    // count total transactions for pagination
    const totalCountQuery = Prisma.sql`
      SELECT COALESCE(SUM(count), 0)::bigint AS totaltxncount
      FROM (
        SELECT COUNT(*) AS count FROM "OnRampTransaction" WHERE "userId" = ${userId}
        UNION ALL
        SELECT COUNT(*) AS count FROM "P2pTransaction" WHERE "senderUserId" = ${userId} OR "receiverUserId" = ${userId}
        UNION ALL
        SELECT COUNT(*) AS count FROM "B2bTransaction" WHERE "senderUserId" = ${userId} OR "receiverUserId" = ${userId}
      ) AS totalCounts;
    `;

    const [transactions, countQuery] = await Promise.all([
      db.$queryRaw<TransactionResponse[]>(txnRawQuery),
      db.$queryRaw<{ totaltxncount: bigint }[]>(totalCountQuery),
    ]);

    const totalCount = Number(countQuery[0]?.totaltxncount || 0);

    if (transactions.length === 0) {
      return { success: false, error: "No transactions found" };
    }

    // Transform transactions to consistent format
    const formatTransaction: TransactionResponse[] = transactions.map((txn) => ({
      ...txn,
      date: new Date(txn.date),
      type: txn.type as TransactionType, // Cast to proper enum
      details: typeof txn.details === "string" ? JSON.parse(txn.details) : txn.details,
    }));

    // Calculating if there are more transactions
    const hasMore = totalCount > offset + pageSize;

    const cachedData: TransactionCache = {
      data: formatTransaction,
      totalCount,
      hasMore,
    };

    // set cache for: 2 hours
    await cache.set(
      cacheType.TRANSACTION_PAGE,
      [userId, "page", page.toString()],
      cachedData,
      3600 * 2
    );

    // evict cache for page:2
    await cache.evict(cacheType.TRANSACTION_PAGE, [userId, "page", "2"]);

    return {
      success: true,
      data: formatTransaction,
      totalCount,
      hasMore,
    };
  } catch (error: any) {
    console.log("Failed to fetch All transactions", error);
    return { success: false, error: error.message };
  }
}

export { getAllTransactionAction };
