import { Context } from "hono";

import { cacheType, honoCache } from "@repo/db/cache";
import { NonceArgs } from "@repo/schema/types";

import { Env } from "../api-env";
import { prisma } from "../lib/db";

interface PaymentDetails {
  txnId: string;
  nonce: string;
}

interface PaymentInfo {
  txnId: string;
  nonce: string;
  amount: number;
  senderEmail: string;
  receiverAccountNumber: string;
  recieverName: string;
}

async function paymentDetailsController(c: Context): Promise<Response> {
  const body: PaymentDetails = await c.req.json();
  const { txnId, nonce } = body;
  const env: Env = c.env;
  const db = prisma(env);
  const cache = honoCache.getInstance(env.UPSTASH_REDIS_REST_URL, env.UPSTASH_REDIS_REST_TOKEN);

  try {
    const cachedNonce: NonceArgs = await cache.get(cacheType.NONCE, [nonce]);
    if (!cachedNonce) {
      return c.json({
        success: false,
        message: "Nonce Expired! Retry Payment",
      });
    }

    if (cachedNonce.txnId !== txnId) {
      return c.json({
        success: false,
        message: "Transaction Id Mismatch! Retry Payment",
      });
    }

    const transactionInfo = await db.b2bTransaction.findUnique({
      where: {
        id: txnId,
      },
      select: {
        id: true,
        receiverAccountNumber: true,
        amount: true,
        senderUser: {
          select: {
            email: true,
          },
        },
        receiverUser: {
          select: {
            name: true,
          },
        },
      },
    });

    if (!transactionInfo) {
      return c.json({
        success: false,
        message: "Transaction Not Found! Retry Payment",
      });
    }

    const paymentInfo: PaymentInfo = {
      txnId: transactionInfo.id,
      nonce: nonce,
      amount: transactionInfo.amount,
      senderEmail: transactionInfo.senderUser?.email!,
      receiverAccountNumber: transactionInfo.receiverAccountNumber!,
      recieverName: transactionInfo.receiverUser?.name!,
    };

    return c.json({
      success: true,
      message: "Payment Details Received",
      paymentInfo: paymentInfo,
    });
  } catch (err: any) {
    console.error("> Error while generating payment details:", err.message);
    return c.json({
      success: false,
      message: "Error Occurred! Retry Payment",
    });
  }
}

export { paymentDetailsController };
