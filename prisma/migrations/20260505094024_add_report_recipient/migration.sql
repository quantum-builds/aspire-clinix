-- CreateEnum
CREATE TYPE "ReportRecipient" AS ENUM ('PATIENT', 'REFERRING_DENTIST');

-- AlterTable
ALTER TABLE "Report" ADD COLUMN     "patientId" TEXT,
ADD COLUMN     "recipientType" "ReportRecipient";

-- AddForeignKey
ALTER TABLE "Report" ADD CONSTRAINT "Report_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "Patient"("id") ON DELETE SET NULL ON UPDATE CASCADE;
