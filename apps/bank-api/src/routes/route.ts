import { Hono } from "hono";
import { Env } from "../api-env";
import { bankController } from "../controllers/bankController";
import { paymentDetailsController } from "../controllers/paymentDetailsController";
import { processPaymentController } from "../controllers/processPaymentController";

const app = new Hono<{ Bindings: Env }>();

app.post("/b2bWebhook", bankController);
app.post("/paymentDetails", paymentDetailsController);
app.post("/processPayment", processPaymentController);

export default app;
