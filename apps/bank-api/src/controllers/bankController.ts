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
    const { isProcessed, existingResult } = await checkIdempotency(idempotencyKey, c);
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
    return c.json(response(true, "Transaction Registered", result.paymentToken));
  } catch (error) {
    console.error("> Error while processing Bank API:", error);
    return c.json(response(false, "Internal Server Error"), 500);
  }
}
export { bankController };
