import crypto from "crypto";

// Generate HMAC signature for webhook payload
export const generateSignature = (payload: any, secretKey: string): string => {
  // prettier-ignore
  return crypto
        .createHmac("sha256", secretKey)
        .update(JSON.stringify(payload))
        .digest("hex");
};
