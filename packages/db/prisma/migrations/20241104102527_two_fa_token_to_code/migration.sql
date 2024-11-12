/*
  Warnings:

  - You are about to drop the `TwoFactorToken` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "TwoFactorToken";

-- CreateTable
CREATE TABLE "TwoFactorCode" (
    "id" VARCHAR(30) NOT NULL,
    "email" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TwoFactorCode_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "TwoFactorCode_code_key" ON "TwoFactorCode"("code");

-- CreateIndex
CREATE UNIQUE INDEX "TwoFactorCode_email_code_key" ON "TwoFactorCode"("email", "code");
