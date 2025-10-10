/*
  Warnings:

  - A unique constraint covering the columns `[appointmentId]` on the table `AppointmentRequests` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "AppointmentRequests" ADD COLUMN     "appointmentId" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "AppointmentRequests_appointmentId_key" ON "AppointmentRequests"("appointmentId");

-- AddForeignKey
ALTER TABLE "AppointmentRequests" ADD CONSTRAINT "AppointmentRequests_appointmentId_fkey" FOREIGN KEY ("appointmentId") REFERENCES "Appointment"("id") ON DELETE SET NULL ON UPDATE CASCADE;
