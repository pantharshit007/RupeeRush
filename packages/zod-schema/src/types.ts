export interface P2PWebhookPayload {
  encryptData: EncryptData;
  body: Body;
  timestamp: string;
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

export interface WebhookResponse {
  success: boolean;
  message: string;
}
