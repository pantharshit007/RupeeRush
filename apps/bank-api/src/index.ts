import { Hono } from "hono";
import { type HttpBindings } from "@hono/node-server";
import { Env } from "./api-env";
import { prisma } from "./lib/db";

// type Bindings = HttpBindings & {
//   env:Env;
// };

const app = new Hono<{ Bindings: Env }>();

app.get("/", (c) => {
  return c.text("Hello Hono!");
});

app.get("/bank", async (c) => {
  const db = prisma(c.env);
  const bank = await db.user.findMany();
  return c.json({ bank });
});

export default app;
