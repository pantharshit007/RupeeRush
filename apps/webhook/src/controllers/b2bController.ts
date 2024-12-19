import "dotenv/config";
import { Response, Request } from "express";

import { B2BWebhookPayload, B2BWebhookResponse } from "@repo/schema/types";
import { WEBHOOK_TIMEOUT } from "../utils/constant";
import { validateSignature } from "../lib/validation";
import { processB2BTransaction } from "../lib/processB2BTxn";

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
        message: "No request body found",
        paymentToken: null,
      } as B2BWebhookResponse);
    }

    const body: B2BWebhookPayload = req.body;
    const idempotencyKey: any = req.headers["x-idempotency-key"];

    const response = validateSignature(body, req);
    if (!response.success) {
      return res.status(401).json(response);
    }

    const bankApiResponse = await Promise.race([
      processB2BTransaction(body, idempotencyKey, signal),
      timeoutPromise,
    ]);

    if (!bankApiResponse.success) {
      return res.status(bankApiResponse.code).json({
        success: false,
        message: bankApiResponse.message,
        paymentToken: null,
      });
    }

    return res.status(200).json({
      success: true,
      message: "Bank Response",
      paymentToken: bankApiResponse.paymentToken,
    });
  } catch (err: any) {
    if (timeoutId) clearTimeout(timeoutId);

    console.error("> Error while processing webhook:", err.message);
    if (signal.aborted) {
      return res.status(408).json({
        success: false,
        message: "Request timed out",
        paymentToken: null,
      });
    }

    return res.status(411).json({
      success: false,
      message: err.message || "Internal Server Error",
      paymentToken: null,
    });
  }
}

export { b2bController };
