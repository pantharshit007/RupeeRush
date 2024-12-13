import crypto from "crypto";

interface EncryptedData {
  iv: string;
  data: string;
  authTag: string;
}

/**
 * Decryption helper for webhook data
 * @param encryptedData - The encrypted data object
 * @param webhookSecret - The secret key for decryption
 */

export const decryptData = (encryptedData: EncryptedData, webhookSecret: string) => {
  const key = crypto.createHash("sha256").update(webhookSecret).digest();
  const iv = Buffer.from(encryptedData.iv, "hex");
  const data = Buffer.from(encryptedData.data, "hex");
  const authTag = Buffer.from(encryptedData.authTag, "hex");

  const decipher = crypto.createDecipheriv("aes-256-gcm", key, iv);
  decipher.setAuthTag(authTag);
  const decrypted = Buffer.concat([decipher.update(data), decipher.final()]);

  return JSON.parse(decrypted.toString("utf-8"));
};
