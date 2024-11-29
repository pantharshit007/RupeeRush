import crypto from "crypto";
import "dotenv/config";

import { P2PWebhookPayload, WebhookResponse } from "@repo/schema/types";
import { checkIdempotency, validateSignature } from "../lib/validation";
import { cache, cacheType } from "@repo/db/cache";
import { processP2PTransaction } from "../lib/processTxn";

async function p2pController(req: any, res: any): Promise<WebhookResponse> {
  try {
    if (!req.body) {
      return res.status(401).json({
        success: false,
        message: "No request body found",
      });
    }

    const body: P2PWebhookPayload = req.body;
    const idempotencyKey = req.headers["x-idempotency-key"];

    console.log("> Request Body", body);
    console.log("> Request Headers", req.headers);

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
    const transactionResult = await processP2PTransaction(req.body);

    const cacheData = { ...transactionResult, processedAt: new Date().toISOString() };
    await cache.set(cacheType.IDEMPOTENCY_KEY, [idempotencyKey], cacheData, 1200); // cache for 20 minutes

    return res.status(200).json({
      success: true,
      message: "Payment test completed",
    });
  } catch (err: any) {
    console.error("> Error while processing webhook:", err.message);
    return res.status(411).json({
      success: false,
      message: err.message,
    });
  }
}

export { p2pController };
