/* eslint-disable @typescript-eslint/consistent-type-definitions */
import { z } from "zod";

export const zEnv = z.object({
  DATABASE_URL: z.string(),
  WEBHOOK_BANK_SECRET: z.string(),
  ENVIRONMENT: z.enum(["development", "production"]).default("development"),
  UPSTASH_REDIS_REST_URL: z.string().optional(),
  UPSTASH_REDIS_REST_TOKEN: z.string().optional(),
  ALLOWED_ORIGINS: z.string(),
});

export type Env = z.infer<typeof zEnv>;
