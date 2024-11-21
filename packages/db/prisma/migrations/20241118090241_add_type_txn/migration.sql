/*
  Warnings:

  - You are about to drop the column `token` on the `OnRampTransaction` table. All the data in the column will be lost.
  - Added the required column `type` to the `B2bTransaction` table without a default value. This is not possible if the table is not empty.
  - Added the required column `type` to the `OnRampTransaction` table without a default value. This is not possible if the table is not empty.
  - Added the required column `type` to the `P2pTransaction` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "TransactionType" AS ENUM ('DEPOSIT', 'WITHDRAW', 'TRANSFER', 'RECEIVE');

-- DropIndex
DROP INDEX "OnRampTransaction_token_key";

-- AlterTable
ALTER TABLE "B2bTransaction" ADD COLUMN     "type" "TransactionType" NOT NULL;

-- AlterTable
ALTER TABLE "OnRampTransaction" DROP COLUMN "token",
ADD COLUMN     "type" "TransactionType" NOT NULL;

-- AlterTable
ALTER TABLE "P2pTransaction" ADD COLUMN     "type" "TransactionType" NOT NULL;

-- CreateIndex
CREATE INDEX "OnRampTransaction_userId_idx" ON "OnRampTransaction"("userId");
