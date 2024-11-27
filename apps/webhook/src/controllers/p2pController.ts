import crypto from "crypto";
import "dotenv/config";

function p2pController(req: any, res: any) {
  try {
    if (!req.body) {
      return res.status(401).json({
        success: false,
        message: "No request body found",
      });
    }
    console.log("> Request Body", req.body);
    console.log("> Request Headers", req.headers);

    // Generate HMAC signature for webhook payload
    const generateSignature = (payload: any, secretKey: string): string => {
      return crypto.createHmac("sha256", secretKey).update(JSON.stringify(payload)).digest("hex");
    };

    if (!process.env.WEBHOOK_SECRET) {
      console.log("> Webhook secret not configured");
      return res.status(401).json({
        success: false,
        message: "Webhook secret not configured",
      });
    }

    const signature = generateSignature(req.body, process.env.WEBHOOK_SECRET);

    const incomingSignature: string = req.headers["x-signature"];
    console.log("> Signature Valid:", incomingSignature === signature);

    if (incomingSignature !== signature) {
      console.error("> Signature verification failed");
      return res.status(401).json({
        success: false,
        message: "Signature verification failed",
      });
    }

    throw new Error("Test error");

    return res.status(200).json({
      success: true,
      message: "Payment test completed",
    });
  } catch (err: any) {
    console.error("> Error while processing webhook:", err.message);
    return res.status(411).json({
      success: false,
      message: err.message,
    });
  }
}

export { p2pController };
