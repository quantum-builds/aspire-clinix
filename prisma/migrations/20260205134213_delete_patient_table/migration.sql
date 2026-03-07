/*
  Warnings:

  - You are about to drop the `Patient` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Appointment" DROP CONSTRAINT "Appointment_patientId_fkey";

-- DropForeignKey
ALTER TABLE "AppointmentRequests" DROP CONSTRAINT "AppointmentRequests_patientId_fkey";

-- DropForeignKey
ALTER TABLE "Cart" DROP CONSTRAINT "Cart_patientId_fkey";

-- DropForeignKey
ALTER TABLE "ReferralForm" DROP CONSTRAINT "ReferralForm_patientId_fkey";

-- DropForeignKey
ALTER TABLE "Report" DROP CONSTRAINT "Report_patientId_fkey";

-- DropTable
DROP TABLE "Patient";
