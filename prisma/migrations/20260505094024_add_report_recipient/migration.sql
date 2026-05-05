-- CreateEnum
CREATE TYPE "ReportRecipient" AS ENUM ('PATIENT', 'REFERRING_DENTIST');

-- AlterTable
ALTER TABLE "Report" ADD COLUMN     "recipientDentistId" TEXT,
ADD COLUMN     "recipientPatientId" TEXT,
ADD COLUMN     "recipientType" "ReportRecipient";

-- CreateIndex
CREATE INDEX "Report_recipientType_recipientPatientId_idx" ON "Report"("recipientType", "recipientPatientId");

-- CreateIndex
CREATE INDEX "Report_recipientType_recipientDentistId_idx" ON "Report"("recipientType", "recipientDentistId");

-- AddForeignKey
ALTER TABLE "Report" ADD CONSTRAINT "Report_recipientPatientId_fkey" FOREIGN KEY ("recipientPatientId") REFERENCES "Patient"("id") ON DELETE SET NULL ON UPDATE CASCADE;
