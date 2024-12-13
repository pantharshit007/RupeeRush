import "dotenv/config";
import { Response, Request } from "express";

import { B2BWebhookPayload, B2BWebhookResponse } from "@repo/schema/types";
import { WEBHOOK_TIMEOUT } from "../utils/constant";
import { validateSignature } from "../lib/validation";

async function b2bController(req: Request, res: Response): Promise<Response<B2BWebhookResponse>> {
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
        // message: "No request body found",
        externalLink: null,
      } as B2BWebhookResponse);
    }

    const body: B2BWebhookPayload = req.body;
    const idempotencyKey = req.headers["x-idempotency-key"];

    const response = validateSignature(body, req);
    if (!response.success) {
      return res.status(401).json(response);
    }

    if (timeoutId) clearTimeout(timeoutId);
    // Test response
    return res.status(200).json({
      success: true,
      message: "Transaction Processed",
      externalLink: "https://www.google.com",
    });
  } catch (err: any) {
    if (timeoutId) clearTimeout(timeoutId);

    console.error("> Error while processing webhook:", err.message);
    if (signal.aborted) {
      return res.status(408).json({
        success: false,
        message: "Request timed out",
        externalLink: null,
      });
    }

    return res.status(411).json({
      success: false,
      message: err.message || "Internal Server Error",
      externalLink: null,
    });
  }
}

export { b2bController };
