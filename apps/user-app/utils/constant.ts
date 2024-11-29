import { SchemaTypes } from "@repo/db/client";

interface BanksProps {
  name: SchemaTypes.Bank;
  redirectUrl: string;
}

export const SUPPORTED_BANKS: BanksProps[] = [
  {
    name: "HDFC",
    redirectUrl: "https://netbanking.hdfcbank.com",
  },
  {
    name: "AXIS",
    redirectUrl: "https://www.axisbank.com/",
  },
];

export const REGEXP_ONLY_DIGITS_AND_CHARS = "^[a-zA-Z0-9]+$";
export const REGEXP_ONLY_DIGITS = "^\\d+$";

export const WALLET_PIN_ATTEMPTS_LIMIT = 3;
export const WALLET_LOCK_DURATION = 30 * 60 * 1000; // 30 minutes
export const WEBHOOK_TIMEOUT = 30000; // 30 seconds timeout for webhook request

// Exponential backoff configuration
export const RETRY_CONFIG = {
  maxRetries: 3,
  initialBackoffMs: 5000, // Start: 5 second
  backoffMultiplier: 2, // Double the backoff each retry
  maxBackoffMs: 30000, // Max 30 seconds between retries
};
