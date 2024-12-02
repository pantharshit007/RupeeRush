import { cache, cacheType } from "@repo/db/cache";
import crypto from "crypto";
import "dotenv/config";
import { Request } from "express";

const WEBHOOK_SECRET = process.env.WEBHOOK_SECRET;

// Generate HMAC signature for webhook payload
const generateSignature = (payload: any, secretKey: string): string => {
  return crypto.createHmac("sha256", secretKey).update(JSON.stringify(payload)).digest("hex");
};

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
    const idempotencyRecord = await cache.get(cacheType.IDEMPOTENCY_KEY, [key]);

    if (idempotencyRecord) {
      return {
        isProcessed: true,
        existingResult: idempotencyRecord,
      };
    }

    return { isProcessed: false };
  } catch (err: any) {
    console.error("> Error while checking idempotency key:", err.message);
    return { isProcessed: false };
  }
};
