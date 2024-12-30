export interface CacheProps {
  set(type: string, args: string[], value: any, expirySeconds?: number): Promise<void>;
  get(type: string, args: string[]): Promise<any>;
  evict(type: string, args: string[]): Promise<null>;
}

export interface CacheEntryProps {
  value: any;
  expiry: number;
}

export const CACHE_TYPES = {
  USER: "USER",
  BANK_BALANCE: "BANK_BALANCE",
  WALLET_BALANCE: "WALLET_BALANCE",
  WALLET_BANK_BALANCE: "WALLET_BANK_BALANCE",
  ON_RAMP_TRANSACTION: "ON_RAMP_TRANSACTION",
  P2P_TRANSACTION: "P2P_TRANSACTION",
  B2B_TRANSACTION: "B2B_TRANSACTION",
  PHONE_NUMBER: "PHONE_NUMBER",
  UPI_ID: "UPI_ID",
  WALLET_PIN: "WALLET_PIN",
  IDEMPOTENCY_KEY: "IDEMPOTENCY_KEY",
  CREDIT_CARD: "CREDIT_CARD",
  NONCE: "NONCE",
  TRANSACTION_PAGE: "TRANSACTION_PAGE",
};
