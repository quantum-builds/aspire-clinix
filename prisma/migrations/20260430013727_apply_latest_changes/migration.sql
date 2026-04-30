/*
  Warnings:

  - You are about to drop the `Appointment` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Appointment" DROP CONSTRAINT "Appointment_dentistId_fkey";

-- DropForeignKey
ALTER TABLE "Appointment" DROP CONSTRAINT "Appointment_practiceId_fkey";

-- DropForeignKey
ALTER TABLE "Appointment" DROP CONSTRAINT "Appointment_referralRequestId_fkey";

-- DropForeignKey
ALTER TABLE "AppointmentRequests" DROP CONSTRAINT "AppointmentRequests_appointmentId_fkey";

-- DropForeignKey
ALTER TABLE "Report" DROP CONSTRAINT "Report_appointmentId_fkey";

-- AlterTable
ALTER TABLE "Dentist" ADD COLUMN     "appointmentIds" TEXT[];

-- AlterTable
ALTER TABLE "Patient" ADD COLUMN     "appointmentIds" TEXT[];

-- DropTable
DROP TABLE "Appointment";
