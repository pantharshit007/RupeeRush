import axios from "axios";
import crypto from "crypto";
import { WebhookResponse } from "@repo/schema/types";

import { RETRY_CONFIG, WEBHOOK_TIMEOUT } from "@/utils/constant";
import { isErrorRetryable, WebhookError } from "@/utils/error";

const WEBHOOK_URL = process.env.WEBHOOK_URL;

// Generate HMAC signature for webhook payload
const generateSignature = (payload: any, secretKey: string): string => {
  return crypto.createHmac("sha256", secretKey).update(JSON.stringify(payload)).digest("hex");
};

/**
 * Call webhook API with advanced retry and idempotency mechanisms
 * @param webhookPayload Payload to send
 * @returns WebhookResponse
 */
export const callWebhook = async (webhookPayload: any): Promise<WebhookResponse> => {
  // Generate a unique idempotency key for this request
  const idempotencyKey = crypto.randomUUID();

  for (let attempt = 1; attempt <= RETRY_CONFIG.maxRetries; attempt++) {
    try {
      if (!WEBHOOK_URL) {
        throw new WebhookError("Webhook URL not configured", false);
      }

      const timestamp = Date.now().toString();

      const payload = {
        ...webhookPayload,
        timestamp,
        idempotencyKey,
      };

      const signature = generateSignature(payload, process.env.WEBHOOK_SECRET!);

      const response = await axios.post(WEBHOOK_URL, payload, {
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
      if (attempt === RETRY_CONFIG.maxRetries || !isRetryable) {
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
