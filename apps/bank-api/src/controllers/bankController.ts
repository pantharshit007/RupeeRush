import { Context } from "hono";
import { response } from "../lib/response";
import { checkIdempotency, validateSignature } from "../lib/validation";
import { BankPayload } from "@repo/schema/types";
import { processTransaction } from "../lib/processBankTxn";

async function bankController(c: Context): Promise<Response> {
  const body: BankPayload = await c.req.json();
  const idempotencyKey = c.req.header("x-idempotency-key");
  const signature = c.req.header("x-signature");

  try {
    if (!idempotencyKey || !signature) {
      return c.json(response(false, "Missing headers"), 400);
    }

    // check idempotency key
    const { isProcessed, isAvailable, existingResult } = await checkIdempotency(idempotencyKey, c);
    if (!isAvailable) {
      return c.json(response(false, "Idempotency key not available", existingResult), 409);
    }

    if (isProcessed) {
      return c.json(response(false, "Idempotency key already processed", existingResult), 409);
    }

    // validate signature
    const res = validateSignature(body, signature, c);
    if (!res.success) {
      return c.json(response(false, res.message), 401);
    }

    // process transaction
    const result = await processTransaction(c, body);
    if (!result.success) {
      return c.json(response(false, result.message), 401);
    }

    // return response
    return c.json(
      response(
        true,
        "Transaction Registered: complete the payment on the bank site.",
        result.paymentToken
      )
    );
  } catch (error: any) {
    console.error("> Error while processing Bank API:", error);
    return c.json(response(false, error.message || "Internal Server Error"), 500);
  }
}
export { bankController };
