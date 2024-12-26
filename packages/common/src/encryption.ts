import crypto from "crypto";

interface DataArgs {
  senderId: string;
  receiverId: string;
  txnId?: string;
  pin?: string;
}

interface EncryptedData {
  iv: string;
  data: string;
  authTag: string;
}

/**
 * Encryption helper for webhook data
 * @param data `{ senderId, receiverId, ? txnId, ? pin }`
 * @param webhookSecret
 */
// export const encryptData = (data: DataArgs, webhookSecret: string) => {
//   const key = crypto.createHash("sha256").update(webhookSecret).digest();
//   const iv = crypto.randomBytes(12);
//   const cipher = crypto.createCipheriv("aes-256-gcm", key, iv);
//   const encrypted = Buffer.concat([cipher.update(JSON.stringify(data), "utf8"), cipher.final()]);
//   const authTag = cipher.getAuthTag();

//   return {
//     iv: iv.toString("hex"),
//     data: encrypted.toString("hex"),
//     authTag: authTag.toString("hex"),
//   };
// };

export async function encryptData(data: DataArgs, webhookSecret: string): Promise<EncryptedData> {
  const encoder = new TextEncoder();

  // Generate key from webhook secret
  const keyBuffer = await crypto.subtle.digest("SHA-256", encoder.encode(webhookSecret));

  // Import as CryptoKey
  const key = await crypto.subtle.importKey("raw", keyBuffer, { name: "AES-GCM" }, false, [
    "encrypt",
  ]);

  // Generate random IV
  const iv = crypto.getRandomValues(new Uint8Array(12));

  // Encrypt the data
  const encodedData = encoder.encode(JSON.stringify(data));
  const encryptedContent = await crypto.subtle.encrypt(
    {
      name: "AES-GCM",
      iv: iv,
    },
    key,
    encodedData
  );

  // Split encrypted content and auth tag
  const encryptedArray = new Uint8Array(encryptedContent);
  const encrypted = encryptedArray.slice(0, -16);
  const authTag = encryptedArray.slice(-16);

  // Convert to hex strings
  return {
    iv: Buffer.from(iv).toString("hex"),
    data: Buffer.from(encrypted).toString("hex"),
    authTag: Buffer.from(authTag).toString("hex"),
  };
}

// had to create a hold fing function for hono:🤬
