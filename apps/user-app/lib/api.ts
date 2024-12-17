import axios from "axios";
import crypto from "crypto";
import {
  B2BWebhookPayload,
  B2BWebhookResponse,
  IdepotencyCache,
  P2PWebhookPayload,
  P2PWebhookResponse,
} from "@repo/schema/types";
import { cache, cacheType } from "@repo/db/cache";
import { generateSignature } from "@repo/common/generateSignature";

import { RETRY_CONFIG, WEBHOOK_TIMEOUT } from "@/utils/constant";
import { isErrorRetryable, WebhookError } from "@/utils/error";

const WEBHOOK_URL = process.env.WEBHOOK_URL;

interface KeyProps {
  senderInfo: string;
  recipientInfo: string;
  amount: number;
}

// Generate Idempotency Key
const generateIdempotencyKey = ({ senderInfo, recipientInfo, amount }: KeyProps): string => {
  const keyComponents = [senderInfo, recipientInfo, amount?.toString()].join("|");

  return crypto.createHash("sha256").update(keyComponents).digest("hex");
};

/**
 * Call webhook API with advanced retry and idempotency mechanisms
 * @param webhookPayload Payload to send
 * @returns P2PWebhookResponse
 */

export const callP2PWebhook = async (
  webhookPayload: P2PWebhookPayload
): Promise<P2PWebhookResponse> => {
  // Generate a unique idempotency key
  const idempotencyKey = generateIdempotencyKey({
    senderInfo: webhookPayload.body.senderIdentifier,
    recipientInfo: webhookPayload.body.receiverIdentifier,
    amount: webhookPayload.body.amount,
  });

  const idempotencyCache: IdepotencyCache = {
    lastUpdated: new Date().toISOString(),
    processedAt: null,
    status: "PENDING",
  };

  await cache.set(cacheType.IDEMPOTENCY_KEY, [idempotencyKey], idempotencyCache, 1200); // 20 minutes

  for (let attempt = 1; attempt <= RETRY_CONFIG.maxRetries; attempt++) {
    try {
      if (!WEBHOOK_URL) {
        throw new WebhookError("Webhook URL not configured", false);
      }

      const timestamp = Date.now().toString();

      const payload: P2PWebhookPayload = {
        ...webhookPayload,
        timestamp,
        idempotencyKey,
      };

      const signature = generateSignature(payload, process.env.WEBHOOK_SECRET!);

      const endPoint = `${WEBHOOK_URL}/api/v1/p2pWebhook`;
      const response = await axios.post(endPoint, payload, {
        headers: {
          "Content-Type": "application/json",
          "X-Timestamp": timestamp,
          "X-Signature": signature,
          "X-Idempotency-Key": idempotencyKey,
        },
        timeout: WEBHOOK_TIMEOUT,
      });

      // Successful response
      if (response.status === 200 && response.data.success) {
        return response.data;
      }

      // Handle non-success responses
      throw new WebhookError(`Webhook failed: ${response.data.message}`);
    } catch (error: any) {
      // Determine if the error is retryable
      const isRetryable = isErrorRetryable(error);

      // If it's the last attempt or not retryable, return failure
      if (attempt > RETRY_CONFIG.maxRetries || !isRetryable) {
        console.error(
          `> Webhook call failed after ${attempt} attempts:`,
          error.response.data.message
        );
        return {
          success: false,
          message: error.response.data.message || error.message || "Webhook failed",
        };
      }

      // Calculate exponential backoff
      const backoffMs = Math.min(
        RETRY_CONFIG.initialBackoffMs * Math.pow(RETRY_CONFIG.backoffMultiplier, attempt - 1),
        RETRY_CONFIG.maxBackoffMs

        // attempt 1: 5 sec
        // attempt 2: 5 sec * 2 = 10 sec
        // attempt 3: 5 sec * 2 ^ 2 = 20 sec
      );

      // Wait before retrying
      console.log("> Waiting for", backoffMs, "ms before retrying");
      await new Promise((resolve) => setTimeout(resolve, backoffMs));
    }
  }

  // Fallback: (though should never reach here due to the loop)
  return { success: false, message: "Webhook failed" };
};

/**
 * Calls the webhook for a B2B transaction
 * @param webhookPayload Payload to send
 * @returns B2BWebhookResponse
 */

export const callB2BWebhook = async (
  webhookPayload: B2BWebhookPayload
): Promise<B2BWebhookResponse> => {
  // Generate unique idempotency key
  const idempotencyKey = generateIdempotencyKey({
    senderInfo: webhookPayload.body.senderIdentifier!,
    recipientInfo: webhookPayload.body.receiverIdentifier!,
    amount: webhookPayload.body.amount,
  });

  // Check if the key exists in the cache
  const isKeyExists: IdepotencyCache = await cache.get(cacheType.IDEMPOTENCY_KEY, [idempotencyKey]);
  if (isKeyExists && isKeyExists.status === "PROCESSED") {
    return { success: true, message: "Transaction already processed", externalLink: null };
  }

  const idempotencyCache: IdepotencyCache = {
    lastUpdated: new Date().toISOString(),
    processedAt: null,
    status: "PENDING",
  };

  await cache.set(cacheType.IDEMPOTENCY_KEY, [idempotencyKey], idempotencyCache, 600); // 10 minutes

  try {
    if (!WEBHOOK_URL) {
      throw new Error("Webhook URL not configured");
    }

    const timestamp = Date.now().toString();

    const payload: B2BWebhookPayload = {
      ...webhookPayload,
      timestamp,
      idempotencyKey,
    };

    const signature = generateSignature(payload, process.env.WEBHOOK_SECRET!);

    const endPoint = `${WEBHOOK_URL}/api/v1/b2bWebhook`;
    const headers = {
      "Content-Type": "application/json",
      "X-Timestamp": timestamp,
      "X-Signature": signature,
      "X-Idempotency-Key": idempotencyKey,
    };

    const response = await axios.post(endPoint, payload, {
      headers,
      timeout: WEBHOOK_TIMEOUT,
    });

    if (response.status === 200 && response.data.success) {
      return response.data;
    }

    throw new Error(`Webhook failed: ${response.data.message}`);
  } catch (err: any) {
    console.error("> Error while calling B2B webhook:", err);
    return { success: false, message: err.message || "Something went wrong", externalLink: null };
  }
};
