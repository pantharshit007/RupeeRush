import { B2BWebhookResponse } from "@repo/schema/types";

export const response = (
  success: boolean,
  message: string,
  externalLink: string | null = null
): B2BWebhookResponse => {
  return {
    success,
    message,
    externalLink,
  };
};
