/*
  Warnings:

  - You are about to drop the `Admin` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Appointment` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Dentist` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Discount` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Invoice` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Patient` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `PatientTreatment` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Payment` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Plan` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ReferralForm` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Treatment` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `User` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `UserSubscribedPlans` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_PatientDentists` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Admin" DROP CONSTRAINT "Admin_userId_fkey";

-- DropForeignKey
ALTER TABLE "Appointment" DROP CONSTRAINT "Appointment_dentistId_fkey";

-- DropForeignKey
ALTER TABLE "Appointment" DROP CONSTRAINT "Appointment_patientId_fkey";

-- DropForeignKey
ALTER TABLE "Dentist" DROP CONSTRAINT "Dentist_userId_fkey";

-- DropForeignKey
ALTER TABLE "Invoice" DROP CONSTRAINT "Invoice_userId_fkey";

-- DropForeignKey
ALTER TABLE "Patient" DROP CONSTRAINT "Patient_userId_fkey";

-- DropForeignKey
ALTER TABLE "PatientTreatment" DROP CONSTRAINT "PatientTreatment_treatmentId_fkey";

-- DropForeignKey
ALTER TABLE "Payment" DROP CONSTRAINT "Payment_invoiceId_fkey";

-- DropForeignKey
ALTER TABLE "Plan" DROP CONSTRAINT "Plan_discountId_fkey";

-- DropForeignKey
ALTER TABLE "UserSubscribedPlans" DROP CONSTRAINT "UserSubscribedPlans_planId_fkey";

-- DropForeignKey
ALTER TABLE "UserSubscribedPlans" DROP CONSTRAINT "UserSubscribedPlans_userId_fkey";

-- DropForeignKey
ALTER TABLE "_PatientDentists" DROP CONSTRAINT "_PatientDentists_A_fkey";

-- DropForeignKey
ALTER TABLE "_PatientDentists" DROP CONSTRAINT "_PatientDentists_B_fkey";

-- DropTable
DROP TABLE "Admin";

-- DropTable
DROP TABLE "Appointment";

-- DropTable
DROP TABLE "Dentist";

-- DropTable
DROP TABLE "Discount";

-- DropTable
DROP TABLE "Invoice";

-- DropTable
DROP TABLE "Patient";

-- DropTable
DROP TABLE "PatientTreatment";

-- DropTable
DROP TABLE "Payment";

-- DropTable
DROP TABLE "Plan";

-- DropTable
DROP TABLE "ReferralForm";

-- DropTable
DROP TABLE "Treatment";

-- DropTable
DROP TABLE "User";

-- DropTable
DROP TABLE "UserSubscribedPlans";

-- DropTable
DROP TABLE "_PatientDentists";
