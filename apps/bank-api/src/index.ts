import { Hono } from "hono";
import { cors } from "hono/cors";
import { type HttpBindings } from "@hono/node-server";

import { Env } from "./api-env";
import routes from "./routes/route";
import { response } from "./lib/response";

// type Bindings = HttpBindings & {
//   env:Env;
// };

const app = new Hono<{ Bindings: Env }>();

app.use("/*", (c, next) => {
  const corsMiddlewareHandler = cors({
    origin: "*",
  });
  return corsMiddlewareHandler(c, next);
});

app.get("/", (c) => {
  return c.json({
    message: "Hello Mom!",
  });
});

app.get("/ping", (c) => {
  return c.json({
    message: "pong",
  });
});

app.use("/api/*", async (c, next) => {
  const idempotencyKey = c.req.header("x-idempotency-key");
  if (!idempotencyKey) {
    return c.json(response(false, "Missing Idempotency Key"), 400);
  }

  return next();
});

app.route("/api/v1", routes);

export default app;
