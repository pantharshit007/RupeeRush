import crypto from "crypto";

/**
 * Encryption helper for webhook data
 * @param data
 * @param webhookSecret
 */
export const encryptData = (data: any, webhookSecret: string) => {
  const key = crypto.createHash("sha256").update(webhookSecret).digest();
  const iv = crypto.randomBytes(12);
  const cipher = crypto.createCipheriv("aes-256-gcm", key, iv);
  const encrypted = Buffer.concat([cipher.update(JSON.stringify(data), "utf8"), cipher.final()]);
  const authTag = cipher.getAuthTag();

  return {
    iv: iv.toString("hex"),
    data: encrypted.toString("hex"),
    authTag: authTag.toString("hex"),
  };
};
