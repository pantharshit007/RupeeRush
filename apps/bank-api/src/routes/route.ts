import { Hono } from "hono";
import { Env } from "../api-env";
import { bankController } from "../controllers/bankController";

const app = new Hono<{ Bindings: Env }>();

app.post("/b2bWebhook", bankController);

export default app;
