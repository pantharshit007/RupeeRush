import { Context } from "hono";
import { response } from "../lib/response";
import { checkIdempotency, validateSignature } from "../lib/validation";

async function bankController(c: Context): Promise<Response> {
  const body = await c.req.json();
  const idempotencyKey = c.req.header("x-idempotency-key");
  const signature = c.req.header("x-signature");

  if (!idempotencyKey || !signature) {
    return c.json(response(false, "Missing headers"), 400);
  }

  // check idempotency key
  const { isProcessed, existingResult } = await checkIdempotency(idempotencyKey);
  if (isProcessed) {
    return c.json(response(false, "Idempotency key already processed", existingResult), 409);
  }

  console.log(body);

  return c.json(response(true, "Transaction processed", "https://google.com"));

  // validate signature
  // const res = validateSignature(body, signature, c);
  // if (!res.success) {
  //   return c.json(response(false, res.message), 401);
  // }

  // process transaction

  // return response
}

export { bankController };
