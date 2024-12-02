/*
  Warnings:

  - The values [SENT] on the enum `WebhookStatus` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "WebhookStatus_new" AS ENUM ('PENDING', 'FAILED', 'COMPLETED');
ALTER TABLE "P2pTransaction" ALTER COLUMN "webhookStatus" TYPE "WebhookStatus_new" USING ("webhookStatus"::text::"WebhookStatus_new");
ALTER TABLE "B2bTransaction" ALTER COLUMN "webhookStatus" TYPE "WebhookStatus_new" USING ("webhookStatus"::text::"WebhookStatus_new");
ALTER TYPE "WebhookStatus" RENAME TO "WebhookStatus_old";
ALTER TYPE "WebhookStatus_new" RENAME TO "WebhookStatus";
DROP TYPE "WebhookStatus_old";
COMMIT;
