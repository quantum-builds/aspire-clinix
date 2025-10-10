-- DropForeignKey
ALTER TABLE "AppointmentRequests" DROP CONSTRAINT "AppointmentRequests_appointmentId_fkey";

-- AddForeignKey
ALTER TABLE "AppointmentRequests" ADD CONSTRAINT "AppointmentRequests_appointmentId_fkey" FOREIGN KEY ("appointmentId") REFERENCES "Appointment"("id") ON DELETE CASCADE ON UPDATE CASCADE;
