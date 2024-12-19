export interface P2PWebhookPayload {
  encryptData: EncryptedData;
  body: Body;
  timestamp?: string;
  idempotencyKey?: string;
}

export interface B2BWebhookPayload {
  encryptData: EncryptedData;
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
interface EncryptedData {
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
  paymentToken: string | null;
}

export interface IdepotencyCache {
  lastUpdated: string;
  processedAt: string | null;
  status: "PENDING" | "PROCESSED" | "FAILED";
}

export interface BankPayload {
  payload: B2BWebhookPayload;
  nonce: string;
}

export interface cachedWalletBalance {
  balance: number;
}

export interface cachedBankBalance {
  balance: number;
}

export interface DataArgs {
  senderId: string;
  receiverId: string;
  txnId?: string;
  pin?: string;
}
