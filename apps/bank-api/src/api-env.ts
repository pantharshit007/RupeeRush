/* eslint-disable @typescript-eslint/consistent-type-definitions */
import { z } from "zod";

export const zEnv = z.object({
  DATABASE_URL: z.string(),
  WEBHOOK_BANK_SECRET: z.string(),
  ENVIRONMENT: z.enum(["development", "production"]).default("development"),
});

export type Env = z.infer<typeof zEnv>;
