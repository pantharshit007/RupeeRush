/*
  Warnings:

  - You are about to drop the column `cardExpiryMonth` on the `BankAccount` table. All the data in the column will be lost.
  - You are about to drop the column `cardExpiryYear` on the `BankAccount` table. All the data in the column will be lost.
  - Added the required column `cardCvv` to the `BankAccount` table without a default value. This is not possible if the table is not empty.
  - Added the required column `cardExpiry` to the `BankAccount` table without a default value. This is not possible if the table is not empty.
  - Added the required column `cardHolder` to the `BankAccount` table without a default value. This is not possible if the table is not empty.
  - Added the required column `cardType` to the `BankAccount` table without a default value. This is not possible if the table is not empty.
  - Made the column `cardNumber` on table `BankAccount` required. This step will fail if there are existing NULL values in that column.
  - Made the column `cardPinHash` on table `BankAccount` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "BankAccount" DROP COLUMN "cardExpiryMonth",
DROP COLUMN "cardExpiryYear",
ADD COLUMN     "cardCvv" TEXT NOT NULL,
ADD COLUMN     "cardExpiry" TEXT NOT NULL,
ADD COLUMN     "cardHolder" TEXT NOT NULL,
ADD COLUMN     "cardType" TEXT NOT NULL,
ALTER COLUMN "cardNumber" SET NOT NULL,
ALTER COLUMN "cardPinHash" SET NOT NULL;
