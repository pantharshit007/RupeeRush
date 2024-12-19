import { generateSignature } from "@repo/common/generateSignature";
import { cacheType, honoCache } from "@repo/db/cache";
import { BankPayload, IdepotencyCache } from "@repo/schema/types";
import { Context } from "hono";
import { Env } from "../api-env";

export const validateSignature = (body: BankPayload, incomingSignature: string, c: Context) => {
  const env: Env = c.env;
  try {
    const WEBHOOK_SECRET = env.WEBHOOK_BANK_SECRET;
    if (!WEBHOOK_SECRET) {
      console.log("> Webhook secret not configured");
      return { success: false, message: "Webhook secret not configured" };
    }

    const signature = generateSignature(body, WEBHOOK_SECRET);

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
 * @param c `Context` object
 * @returns boolean
 */
export const checkIdempotency = async (
  key: string,
  c: Context
): Promise<{
  isProcessed: boolean;
  existingResult?: any;
}> => {
  const env: Env = c.env;
  try {
    const cache = honoCache.getInstance(env.UPSTASH_REDIS_REST_URL, env.UPSTASH_REDIS_REST_TOKEN);
    const idempotencyRecord: IdepotencyCache = await cache.get(cacheType.IDEMPOTENCY_KEY, [key]);

    if (idempotencyRecord && idempotencyRecord.status === "PROCESSED") {
      return { isProcessed: true, existingResult: idempotencyRecord };
    }

    return { isProcessed: false };
  } catch (err: any) {
    console.error("> Error while checking idempotency key:", err.message);
    return { isProcessed: false };
  }
};
