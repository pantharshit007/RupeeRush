/*
  Warnings:

  - The primary key for the `Balance` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `Merchant` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `OnRampTransaction` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the `p2pTransfer` table. If the table is not empty, all the data it contains will be lost.
  - Changed the type of `status` on the `OnRampTransaction` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Made the column `name` on table `User` required. This step will fail if there are existing NULL values in that column.

*/
-- CreateEnum
CREATE TYPE "TransactionStatus" AS ENUM ('SUCCESS', 'FAILURE', 'PROCESSING');

-- CreateEnum
CREATE TYPE "WebhookStatus" AS ENUM ('PENDING', 'SENT', 'FAILED', 'COMPLETED');

-- CreateEnum
CREATE TYPE "TransferMethod" AS ENUM ('UPI', 'PHONENUMBER');

-- DropForeignKey
ALTER TABLE "p2pTransfer" DROP CONSTRAINT "p2pTransfer_receiverUserId_fkey";

-- DropForeignKey
ALTER TABLE "p2pTransfer" DROP CONSTRAINT "p2pTransfer_senderUserId_fkey";

-- AlterTable
ALTER TABLE "Balance" DROP CONSTRAINT "Balance_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "Balance_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "Balance_id_seq";

-- AlterTable
ALTER TABLE "Merchant" DROP CONSTRAINT "Merchant_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE VARCHAR(30),
ADD CONSTRAINT "Merchant_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "Merchant_id_seq";

-- AlterTable
ALTER TABLE "OnRampTransaction" DROP CONSTRAINT "OnRampTransaction_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
DROP COLUMN "status",
ADD COLUMN     "status" "TransactionStatus" NOT NULL,
ADD CONSTRAINT "OnRampTransaction_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "OnRampTransaction_id_seq";

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "walletLockUntil" TIMESTAMP(3),
ADD COLUMN     "walletPin" TEXT,
ADD COLUMN     "walletPinAttempts" INTEGER NOT NULL DEFAULT 0,
ALTER COLUMN "name" SET NOT NULL;

-- DropTable
DROP TABLE "p2pTransfer";

-- DropEnum
DROP TYPE "OnRampStatus";

-- CreateTable
CREATE TABLE "P2pTransaction" (
    "id" TEXT NOT NULL,
    "amount" INTEGER NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "status" "TransactionStatus" NOT NULL,
    "webhookId" TEXT,
    "webhookStatus" "WebhookStatus",
    "webhookAttempts" INTEGER NOT NULL DEFAULT 0,
    "lastWebhookAttempt" TIMESTAMP(3),
    "senderUserId" TEXT,
    "receiverUserId" TEXT,
    "sendUpiId" TEXT,
    "receiverUpiId" TEXT,
    "senderIdentifier" TEXT,
    "receiverIdentifier" TEXT,
    "transferMethod" "TransferMethod" NOT NULL,
    "initiatedFromIp" TEXT,
    "userAgent" TEXT,

    CONSTRAINT "P2pTransaction_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "B2bTransaction" (
    "id" TEXT NOT NULL,
    "amount" INTEGER NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "status" "TransactionStatus" NOT NULL,
    "webhookId" TEXT,
    "webhookStatus" "WebhookStatus",
    "webhookAttempts" INTEGER NOT NULL DEFAULT 0,
    "lastWebhookAttempt" TIMESTAMP(3),
    "senderUserId" TEXT,
    "receiverUserId" TEXT,
    "senderAccountNumber" TEXT,
    "receiverAccountNumber" TEXT,
    "senderBankName" TEXT NOT NULL,
    "receiverBankName" TEXT NOT NULL,

    CONSTRAINT "B2bTransaction_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "P2pTransaction_webhookId_key" ON "P2pTransaction"("webhookId");

-- CreateIndex
CREATE INDEX "P2pTransaction_senderUserId_idx" ON "P2pTransaction"("senderUserId");

-- CreateIndex
CREATE INDEX "P2pTransaction_receiverUserId_idx" ON "P2pTransaction"("receiverUserId");

-- CreateIndex
CREATE INDEX "P2pTransaction_webhookId_idx" ON "P2pTransaction"("webhookId");

-- CreateIndex
CREATE UNIQUE INDEX "B2bTransaction_webhookId_key" ON "B2bTransaction"("webhookId");

-- CreateIndex
CREATE INDEX "B2bTransaction_senderUserId_idx" ON "B2bTransaction"("senderUserId");

-- CreateIndex
CREATE INDEX "B2bTransaction_receiverUserId_idx" ON "B2bTransaction"("receiverUserId");

-- CreateIndex
CREATE INDEX "B2bTransaction_webhookId_idx" ON "B2bTransaction"("webhookId");

-- AddForeignKey
ALTER TABLE "P2pTransaction" ADD CONSTRAINT "P2pTransaction_senderUserId_fkey" FOREIGN KEY ("senderUserId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "P2pTransaction" ADD CONSTRAINT "P2pTransaction_receiverUserId_fkey" FOREIGN KEY ("receiverUserId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "B2bTransaction" ADD CONSTRAINT "B2bTransaction_senderUserId_fkey" FOREIGN KEY ("senderUserId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "B2bTransaction" ADD CONSTRAINT "B2bTransaction_receiverUserId_fkey" FOREIGN KEY ("receiverUserId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
