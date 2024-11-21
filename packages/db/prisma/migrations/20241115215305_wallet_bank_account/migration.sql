/*
  Warnings:

  - The values [PHONENUMBER] on the enum `TransferMethod` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `bankName` on the `User` table. All the data in the column will be lost.
  - You are about to drop the `Balance` table. If the table is not empty, all the data it contains will be lost.
  - Changed the type of `provider` on the `OnRampTransaction` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "Bank" AS ENUM ('HDFC', 'AXIS');

-- AlterEnum
BEGIN;
CREATE TYPE "TransferMethod_new" AS ENUM ('UPI', 'PHONE');
ALTER TABLE "P2pTransaction" ALTER COLUMN "transferMethod" TYPE "TransferMethod_new" USING ("transferMethod"::text::"TransferMethod_new");
ALTER TYPE "TransferMethod" RENAME TO "TransferMethod_old";
ALTER TYPE "TransferMethod_new" RENAME TO "TransferMethod";
DROP TYPE "TransferMethod_old";
COMMIT;

-- DropForeignKey
ALTER TABLE "Balance" DROP CONSTRAINT "Balance_userId_fkey";

-- AlterTable
ALTER TABLE "OnRampTransaction" DROP COLUMN "provider",
ADD COLUMN     "provider" "Bank" NOT NULL;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "bankName";

-- DropTable
DROP TABLE "Balance";

-- CreateTable
CREATE TABLE "WalletBalance" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "balance" INTEGER NOT NULL,
    "locked" INTEGER NOT NULL,

    CONSTRAINT "WalletBalance_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BankAccount" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "phoneNumber" TEXT NOT NULL,
    "bankName" "Bank" NOT NULL,
    "accountNumber" TEXT NOT NULL,
    "balance" INTEGER NOT NULL,
    "cardNumber" TEXT,
    "cardExpiryMonth" INTEGER,
    "cardExpiryYear" INTEGER,
    "cardPinHash" TEXT,

    CONSTRAINT "BankAccount_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "WalletBalance_userId_key" ON "WalletBalance"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "BankAccount_userId_key" ON "BankAccount"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "BankAccount_phoneNumber_key" ON "BankAccount"("phoneNumber");

-- CreateIndex
CREATE UNIQUE INDEX "BankAccount_accountNumber_key" ON "BankAccount"("accountNumber");

-- CreateIndex
CREATE UNIQUE INDEX "BankAccount_cardNumber_key" ON "BankAccount"("cardNumber");

-- CreateIndex
CREATE INDEX "BankAccount_userId_idx" ON "BankAccount"("userId");

-- CreateIndex
CREATE INDEX "BankAccount_accountNumber_idx" ON "BankAccount"("accountNumber");

-- AddForeignKey
ALTER TABLE "WalletBalance" ADD CONSTRAINT "WalletBalance_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BankAccount" ADD CONSTRAINT "BankAccount_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
