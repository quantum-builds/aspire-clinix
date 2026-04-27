-- DropForeignKey
ALTER TABLE "Report" DROP CONSTRAINT "Report_appointmentId_fkey";

-- CreateIndex
CREATE INDEX "Report_appointmentId_idx" ON "Report"("appointmentId");

-- AddForeignKey
ALTER TABLE "Report" ADD CONSTRAINT "Report_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "Patient"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Report" ADD CONSTRAINT "Report_appointmentId_fkey" FOREIGN KEY ("appointmentId") REFERENCES "Appointment"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
