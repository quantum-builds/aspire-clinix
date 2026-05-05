/*
  Warnings:

  - You are about to drop the column `recipientDentistId` on the `Report` table. All the data in the column will be lost.
  - You are about to drop the column `recipientPatientId` on the `Report` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Report" DROP CONSTRAINT "Report_recipientPatientId_fkey";

-- DropIndex
DROP INDEX "Report_recipientType_recipientDentistId_idx";

-- DropIndex
DROP INDEX "Report_recipientType_recipientPatientId_idx";

-- AlterTable
ALTER TABLE "Report" DROP COLUMN "recipientDentistId",
DROP COLUMN "recipientPatientId",
ADD COLUMN     "patientId" TEXT;

-- AddForeignKey
ALTER TABLE "Report" ADD CONSTRAINT "Report_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "Patient"("id") ON DELETE SET NULL ON UPDATE CASCADE;
