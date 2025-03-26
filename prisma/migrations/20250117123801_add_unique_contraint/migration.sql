/*
  Warnings:

  - A unique constraint covering the columns `[dentistId,patientId,appointmentDate]` on the table `Appointment` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[patientId,treatmentId,treatmentDate]` on the table `PatientTreatment` will be added. If there are existing duplicate values, this will fail.
  - Made the column `email` on table `Dentist` required. This step will fail if there are existing NULL values in that column.
  - Made the column `email` on table `Patient` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Dentist" ALTER COLUMN "email" SET NOT NULL;

-- AlterTable
ALTER TABLE "Patient" ALTER COLUMN "email" SET NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Appointment_dentistId_patientId_appointmentDate_key" ON "Appointment"("dentistId", "patientId", "appointmentDate");

-- CreateIndex
CREATE UNIQUE INDEX "PatientTreatment_patientId_treatmentId_treatmentDate_key" ON "PatientTreatment"("patientId", "treatmentId", "treatmentDate");
