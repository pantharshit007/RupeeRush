import axios from "axios";
import crypto from "crypto";
import { WEBHOOK_TIMEOUT } from "@/utils/constant";

const WEBHOOK_URL = process.env.WEBHOOK_URL;

interface WebhookResponse {
  success: boolean;
  message: string;
}

// Generate HMAC signature for webhook payload
const generateSignature = (payload: any, secretKey: string): string => {
  return crypto.createHmac("sha256", secretKey).update(JSON.stringify(payload)).digest("hex");
};

/**
 * Call webhook API and handle initial response
 * @param webhookPayload
 */
export const callWebhook = async (webhookPayload: any): Promise<WebhookResponse> => {
  try {
    if (!WEBHOOK_URL) {
      throw new Error("Webhook URL not configured");
    }

    // Generate timestamp for request
    const timestamp = Date.now().toString();

    // Prepare the payload with timestamp
    const payload = {
      ...webhookPayload,
      timestamp,
    };

    const signature = generateSignature(payload, process.env.WEBHOOK_SECRET!);

    const response = await axios.post(WEBHOOK_URL, payload, {
      headers: {
        "Content-Type": "application/json",
        "X-Timestamp": timestamp,
        "X-Signature": signature,
      },
      timeout: WEBHOOK_TIMEOUT,
    });

    if (response.status !== 200 || !response.data.success) {
      throw new Error(`Webhook failed: ${response.data.message}`);
    }

    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.response) {
        return { success: false, message: error.response.data.message };
      } else if (error.request) {
        return { success: false, message: error.request.data.message || "Request failed" };
      }
    }

    console.error("> Error while calling webhook API:", error);
    return { success: false, message: "Webhook failed" };
  }
};
