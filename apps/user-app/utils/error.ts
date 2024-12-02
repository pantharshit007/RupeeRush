import axios from "axios";

// custom error for webhook failures
export class WebhookError extends Error {
  isRetryable: boolean;

  constructor(message: string, isRetryable: boolean = true) {
    super(message);
    this.name = "WebhookError";
    this.isRetryable = isRetryable;
  }
}

/**
 * Determine if an error is retryable
 * @param error Error object
 * @returns Boolean indicating if the error can be retried
 */
export function isErrorRetryable(error: Error): boolean {
  // custom error with isRetryable flag
  if (error instanceof WebhookError) {
    return error.isRetryable;
  }

  // network-related errors
  if (axios.isAxiosError(error)) {
    return (
      error.code === "ECONNABORTED" || // timeout
      error.code === "ENOTFOUND" || // DNS failure
      error.code === "ENETUNREACH" || // network unreachable
      !error.response || // no response
      (error.response && error.response.status >= 500) // random server error
    );
  }

  // unknown error: not retryable
  return false;
}
