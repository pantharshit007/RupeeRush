/*
  Warnings:

  - The values [Google,Github] on the enum `AuthType` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "AuthType_new" AS ENUM ('google', 'github');
ALTER TABLE "Merchant" ALTER COLUMN "auth_type" TYPE "AuthType_new" USING ("auth_type"::text::"AuthType_new");
ALTER TYPE "AuthType" RENAME TO "AuthType_old";
ALTER TYPE "AuthType_new" RENAME TO "AuthType";
DROP TYPE "AuthType_old";
COMMIT;
