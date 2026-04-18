-- CreateEnum
CREATE TYPE "MailProvider" AS ENUM ('GMAIL', 'OUTLOOK');

-- AlterTable: MailPilotConfig bekommt Provider-Felder
ALTER TABLE "MailPilotConfig" ADD COLUMN "provider" "MailProvider" NOT NULL DEFAULT 'GMAIL';
ALTER TABLE "MailPilotConfig" ADD COLUMN "outlookAddress" TEXT;
ALTER TABLE "MailPilotConfig" ADD COLUMN "outlookSubscriptionId" TEXT;
ALTER TABLE "MailPilotConfig" ADD COLUMN "outlookSubscriptionExpiry" TIMESTAMP(3);
ALTER TABLE "MailPilotConfig" ADD COLUMN "outlookDeltaLink" TEXT;

-- CreateTable: MicrosoftToken
CREATE TABLE "MicrosoftToken" (
    "id" TEXT NOT NULL,
    "customerId" TEXT NOT NULL,
    "accessToken" TEXT NOT NULL,
    "refreshToken" TEXT,
    "expiresAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "MicrosoftToken_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "MicrosoftToken_customerId_key" ON "MicrosoftToken"("customerId");

ALTER TABLE "MicrosoftToken"
  ADD CONSTRAINT "MicrosoftToken_customerId_fkey"
  FOREIGN KEY ("customerId") REFERENCES "Customer"("id")
  ON DELETE CASCADE ON UPDATE CASCADE;
