import "dotenv/config";

import { P2PWebhookPayload, P2PWebhookResponse } from "@repo/schema/types";
import { checkIdempotency, validateSignature } from "../lib/validation";
import { processP2PTransaction } from "../lib/processP2PTxn";
import { WEBHOOK_TIMEOUT } from "../utils/constant";

async function p2pController(req: any, res: any): Promise<P2PWebhookResponse> {
  const controller = new AbortController();
  const { signal } = controller;

  let timeoutId: NodeJS.Timeout | null = null;
  const timeoutPromise = new Promise((_, reject) => {
    timeoutId = setTimeout(() => {
      controller.abort();
      reject(new Error("Request Timeout"));
    }, WEBHOOK_TIMEOUT);
  });

  try {
    if (!req.body) {
      return res.status(401).json({
        success: false,
        message: "No request body found",
      });
    }

    const body: P2PWebhookPayload = req.body;
    const idempotencyKey = req.headers["x-idempotency-key"];

    const response = validateSignature(body, req);
    if (!response.success) {
      return res.status(401).json(response);
    }

    const { isProcessed, existingResult } = await checkIdempotency(idempotencyKey);
    if (isProcessed) {
      return res.status(200).json({
        success: true,
        message: "Transaction already processed",
        ...existingResult,
      });
    }

    // process transaction
    const transactionResult: any = await Promise.race([
      processP2PTransaction(req.body, idempotencyKey, signal),
      timeoutPromise,
    ]);

    if (!transactionResult.success) {
      return res.status(transactionResult.code).json({
        success: false,
        message: transactionResult.message,
      });
    }

    return res.status(200).json({
      success: true,
      message: "Transaction Processed",
    });
  } catch (err: any) {
    if (timeoutId) clearTimeout(timeoutId);

    console.error("> Error while processing webhook:", err.message);
    if (signal.aborted) {
      return res.status(408).json({
        success: false,
        message: "Request timed out",
      });
    }

    return res.status(411).json({
      success: false,
      message: err.message || "Internal Server Error",
    });
  }
}

export { p2pController };
