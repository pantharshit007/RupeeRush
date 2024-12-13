export interface P2PWebhookPayload {
  encryptData: EncryptData;
  body: Body;
  timestamp?: string;
  idempotencyKey?: string;
}

export interface B2BWebhookPayload {
  encryptData: EncryptData;
  body: B2BWebhookBody;
  timestamp?: string;
  idempotencyKey?: string;
}

interface Body {
  webhookId: string;
  transferMethod: string;
  senderIdentifier: string;
  receiverIdentifier: string;
  amount: number;
}
interface EncryptData {
  iv: string;
  data: string;
  authTag: string;
}

interface B2BWebhookBody {
  webhookId: string | null;
  senderIdentifier: string | null;
  receiverIdentifier: string | null;
  amount: number;
}

export interface P2PWebhookResponse {
  success: boolean;
  message: string;
}

export interface B2BWebhookResponse {
  success: boolean;
  message: string;
  externalLink: string | null;
}

export interface IdepotencyCache {
  lastUpdated: string;
  processedAt: string | null;
  status: "PENDING" | "PROCESSED" | "FAILED";
}
