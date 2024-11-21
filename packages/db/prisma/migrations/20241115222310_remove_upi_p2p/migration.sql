/*
  Warnings:

  - You are about to drop the column `receiverUpiId` on the `P2pTransaction` table. All the data in the column will be lost.
  - You are about to drop the column `sendUpiId` on the `P2pTransaction` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "P2pTransaction" DROP COLUMN "receiverUpiId",
DROP COLUMN "sendUpiId";
