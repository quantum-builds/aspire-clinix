/*
  Warnings:

  - The values [PATIENT] on the enum `ReportRecipient` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "ReportRecipient_new" AS ENUM ('REFERRING_DENTIST', 'BOTH');
ALTER TABLE "Report" ALTER COLUMN "recipientType" TYPE "ReportRecipient_new" USING ("recipientType"::text::"ReportRecipient_new");
ALTER TYPE "ReportRecipient" RENAME TO "ReportRecipient_old";
ALTER TYPE "ReportRecipient_new" RENAME TO "ReportRecipient";
DROP TYPE "public"."ReportRecipient_old";
COMMIT;
