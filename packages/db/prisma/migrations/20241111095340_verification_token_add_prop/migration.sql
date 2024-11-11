-- AlterTable
ALTER TABLE "VerificationToken" ADD COLUMN     "updateEmailId" TEXT,
ALTER COLUMN "hashedPassword" DROP NOT NULL,
ALTER COLUMN "name" DROP NOT NULL;
