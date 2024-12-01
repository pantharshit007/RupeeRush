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

// Custom date formatting function
export function formatDate(timestamp: Date | string) {
  const date = new Date(timestamp);
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  const day = date.getDate();
  const month = months[date.getMonth()];
  const year = date.getFullYear();
  const hours = date.getHours();
  const minutes = date.getMinutes();

  // Format as "Dec 1, 2024, 10:30 AM"
  const formattedDate = `${month} ${day}, ${year}, ${hours}:${minutes < 10 ? "0" + minutes : minutes}`;

  return formattedDate;
}
