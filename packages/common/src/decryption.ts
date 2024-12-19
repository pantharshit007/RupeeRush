import crypto from "crypto";

interface EncryptedData {
  iv: string;
  data: string;
  authTag: string;
}

interface DataArgs {
  senderId: string;
  receiverId: string;
  txnId?: string;
  pin?: string;
}

/**
 * Decryption helper for webhook data
 * @param encryptedData - The encrypted data object
 * @param webhookSecret - The secret key for decryption
 */

// export const decryptData = (encryptedData: EncryptedData, webhookSecret: string) => {
//   const key = crypto.createHash("sha256").update(webhookSecret).digest();
//   const iv = Buffer.from(encryptedData.iv, "hex");
//   const data = Buffer.from(encryptedData.data, "hex");
//   const authTag = Buffer.from(encryptedData.authTag, "hex");

//   const decipher = crypto.createDecipheriv("aes-256-gcm", key, iv);
//   decipher.setAuthTag(authTag);
//   const decrypted = Buffer.concat([decipher.update(data), decipher.final()]);

//   return JSON.parse(decrypted.toString("utf-8"));
// };

export async function decryptData(
  encryptedData: EncryptedData,
  webhookSecret: string
): Promise<DataArgs> {
  const encoder = new TextEncoder();

  // Generate key from webhook secret
  const keyBuffer = await crypto.subtle.digest("SHA-256", encoder.encode(webhookSecret));

  // Import as CryptoKey
  const key = await crypto.subtle.importKey("raw", keyBuffer, { name: "AES-GCM" }, false, [
    "decrypt",
  ]);

  // Convert hex strings to buffers
  const iv = Uint8Array.from(Buffer.from(encryptedData.iv, "hex"));
  const encrypted = Uint8Array.from(Buffer.from(encryptedData.data, "hex"));
  const authTag = Uint8Array.from(Buffer.from(encryptedData.authTag, "hex"));

  // Combine encrypted data and auth tag
  const encryptedContent = new Uint8Array(encrypted.length + authTag.length);
  encryptedContent.set(encrypted);
  encryptedContent.set(authTag, encrypted.length);

  // Decrypt
  const decryptedContent = await crypto.subtle.decrypt(
    {
      name: "AES-GCM",
      iv: iv,
    },
    key,
    encryptedContent
  );

  // Parse and return
  return JSON.parse(new TextDecoder().decode(decryptedContent));
}

// had to create a hold fing function for hono:🤬
