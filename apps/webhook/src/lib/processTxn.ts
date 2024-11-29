import { P2PWebhookPayload } from "@repo/schema/types";

export const processP2PTransaction = async (body: P2PWebhookPayload) => {
  try {
    // TODO: process transaction
    return { success: true, message: "Transaction processed" };
  } catch (err: any) {
    console.error("> Error while processing transaction:", err.message);
    return { success: false, message: err.message };
  }
};
