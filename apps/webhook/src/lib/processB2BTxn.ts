import axios from "axios";
import crypto from "crypto";

import { B2BWebhookPayload, BankPayload } from "@repo/schema/types";
import { generateSignature } from "@repo/common/generateSignature";

import { CustomError, isErrorRetryable } from "../utils/error";
import { RETRY_STRATEGIES, WEBHOOK_TIMEOUT } from "../utils/constant";
import { checkIdempotency } from "./validation";

const BANK_API = process.env.BANK_API_URL;

/**
 * Generate a cryptographically secure nonce
 * Prevents replay attacks and ensures unique transaction identification
 */
const generateNonce = () => {
  const nonce = crypto.randomBytes(32).toString("hex");
  return nonce;
};

export const processB2BTransaction = async (
  body: B2BWebhookPayload,
  idempotencyKey: string,
  signal: AbortSignal
) => {
  if (signal.aborted) {
    return { success: false, code: 408, message: "Request timed out" };
  }

  try {
    const checkAbortSignal = () => {
      if (signal.aborted) {
        throw new Error("Request timed out");
      }
    };

    // Webhook re-try logic
    for (let attempt = 1; attempt <= RETRY_STRATEGIES.length; attempt++) {
      try {
        checkAbortSignal();

        const { isProcessed } = await checkIdempotency(idempotencyKey);
        if (isProcessed) {
          return {
            success: true,
            code: 409,
            message: "Transaction already processed",
            externalLink: null,
          };
        }

        const nonce = generateNonce();
        const timestamp = Date.now().toString();
        const payload: BankPayload = { body, nonce };

        const signature = generateSignature(payload, process.env.WEBHOOK_BANK_SECRET!);

        checkAbortSignal();

        const URL = `${BANK_API}/api/v1/b2bWebhook`;
        const headers = {
          "Content-Type": "application/json",
          "X-Timestamp": timestamp,
          "X-Signature": signature,
          "X-Idempotency-Key": idempotencyKey,
          "X-Webhook-attempt": attempt.toString(),
        };

        const response = await axios.post(URL, payload, {
          headers,
          timeout: WEBHOOK_TIMEOUT,
        });

        if (response.status === 200 && response.data.success) {
          return response.data;
        }

        throw new Error(`Webhook failed: ${response.data.message}`);
      } catch (error: any) {
        // Determine if the error is retryable
        const isRetryable = isErrorRetryable(error);

        // If it's the last attempt or not retryable, return failure
        if (attempt === RETRY_STRATEGIES.length || !isRetryable) {
          console.error(
            `> Webhook call failed after ${attempt} attempts:`,
            error.response.data.message
          );
          return {
            success: false,
            code: 500,
            message: error.response.data.message || error.message || "Webhook failed",
          };
        }

        // Calculate exponential backoff
        const strategy = RETRY_STRATEGIES[attempt - 1] as any;
        const backoffMs = Math.random() * strategy.jitter;

        console.log("> Waiting for", backoffMs, "ms before retrying");
        await new Promise((resolve) => setTimeout(resolve, backoffMs));
      }
    }
  } catch (err: any) {
    console.error("> Error while processing transaction:", err.message);
    if (err instanceof CustomError) {
      return { success: false, code: err.statusCode, message: err.message };
    } else {
      return { success: false, code: 500, message: err.message };
    }
  }
};
