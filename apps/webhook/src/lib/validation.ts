import "dotenv/config";
import { Request } from "express";

import { generateSignature } from "@repo/common/generateSignature";
import { cache, cacheType } from "@repo/db/cache";
import { IdepotencyCache } from "@repo/schema/types";

const WEBHOOK_SECRET = process.env.WEBHOOK_SECRET;

export const validateSignature = (body: any, req: Request) => {
  try {
    if (!WEBHOOK_SECRET) {
      console.log("> Webhook secret not configured");
      return { success: false, message: "Webhook secret not configured" };
    }

    const incomingSignature: string = req.headers["x-signature"] as string;
    const signature = generateSignature(req.body, WEBHOOK_SECRET);

    if (incomingSignature !== signature) {
      return { success: false, message: "Invalid Signature" };
    }

    return { success: true, message: "Signature verified" };
  } catch (err: any) {
    console.error("> Error while validating signature:", err.message);
    return { success: false, message: err.message };
  }
};

/**
 * Check if txn related to this idempotency key is already processed or not
 * @param key
 * @returns boolean
 */
export const checkIdempotency = async (
  key: string
): Promise<{
  isProcessed: boolean;
  existingResult?: any;
}> => {
  try {
    const idempotencyRecord: IdepotencyCache = await cache.get(cacheType.P2P_TRANSACTION, [key]);

    if (idempotencyRecord && idempotencyRecord.status === "PROCESSED") {
      return { isProcessed: true, existingResult: idempotencyRecord };
    }

    return { isProcessed: false };
  } catch (err: any) {
    console.error("> Error while checking idempotency key:", err.message);
    return { isProcessed: false };
  }
};
