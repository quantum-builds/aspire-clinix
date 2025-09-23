/*
  Warnings:

  - Added the required column `appointmentId` to the `Report` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "Report_dentistId_idx";

-- DropIndex
DROP INDEX "Report_patientId_idx";

-- AlterTable
ALTER TABLE "Report" ADD COLUMN     "appointmentId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "Report" ADD CONSTRAINT "Report_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "Patient"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Report" ADD CONSTRAINT "Report_dentistId_fkey" FOREIGN KEY ("dentistId") REFERENCES "Dentist"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Report" ADD CONSTRAINT "Report_appointmentId_fkey" FOREIGN KEY ("appointmentId") REFERENCES "Appointment"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
