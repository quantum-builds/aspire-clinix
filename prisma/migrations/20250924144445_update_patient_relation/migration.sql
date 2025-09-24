/*
  Warnings:

  - Added the required column `patientId` to the `AppointmentRequests` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "AppointmentRequests" ADD COLUMN     "patientId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "AppointmentRequests" ADD CONSTRAINT "AppointmentRequests_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "Patient"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
