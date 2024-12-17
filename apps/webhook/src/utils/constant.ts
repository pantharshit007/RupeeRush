export const ACCOUNT_LOCK_DURATION = 30 * 60 * 1000; // 30 minutes
export const WEBHOOK_TIMEOUT = 15000; // 15 seconds timeout for webhook request

// Exponential backoff configuration
export const RETRY_STRATEGIES = [
  { delay: 1000, jitter: 500 }, // First retry: 1-1.5s
  { delay: 5000, jitter: 1000 }, // Second retry: 5-6s
  { delay: 10000, jitter: 2000 }, // Final retry: 10-12s
];
