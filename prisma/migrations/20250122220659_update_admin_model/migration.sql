/*
  Warnings:

  - You are about to drop the column `patienId` on the `Appointment` table. All the data in the column will be lost.
  - You are about to drop the column `password` on the `Dentist` table. All the data in the column will be lost.
  - You are about to drop the column `password` on the `Patient` table. All the data in the column will be lost.
  - You are about to drop the column `attendAppointment` on the `ReferralForm` table. All the data in the column will be lost.
  - You are about to drop the column `dentistEmail` on the `ReferralForm` table. All the data in the column will be lost.
  - You are about to drop the column `dentistGCDNumber` on the `ReferralForm` table. All the data in the column will be lost.
  - You are about to drop the column `dentistMobileNumber` on the `ReferralForm` table. All the data in the column will be lost.
  - You are about to drop the column `dentistName` on the `ReferralForm` table. All the data in the column will be lost.
  - You are about to drop the column `pateintMobileNumber` on the `ReferralForm` table. All the data in the column will be lost.
  - You are about to drop the column `patientAddress` on the `ReferralForm` table. All the data in the column will be lost.
  - You are about to drop the column `patientDateOfBirth` on the `ReferralForm` table. All the data in the column will be lost.
  - You are about to drop the column `patientEmail` on the `ReferralForm` table. All the data in the column will be lost.
  - You are about to drop the column `patientName` on the `ReferralForm` table. All the data in the column will be lost.
  - You are about to drop the column `referrerDentistId` on the `ReferralForm` table. All the data in the column will be lost.
  - You are about to drop the column `requiredTreatment` on the `ReferralForm` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[dentistId,patientId,appointmentDate]` on the table `Appointment` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[GDCnumber]` on the table `Dentist` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[mobileNumber]` on the table `Dentist` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[userId]` on the table `Dentist` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[mobileNumber]` on the table `Patient` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[userId]` on the table `Patient` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[patientId,dentistId]` on the table `ReferralForm` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `patientId` to the `Appointment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `service` to the `Appointment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `Dentist` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `Patient` table without a default value. This is not possible if the table is not empty.
  - Added the required column `DOB` to the `ReferralForm` table without a default value. This is not possible if the table is not empty.
  - Added the required column `address` to the `ReferralForm` table without a default value. This is not possible if the table is not empty.
  - Added the required column `dentistId` to the `ReferralForm` table without a default value. This is not possible if the table is not empty.
  - Added the required column `email` to the `ReferralForm` table without a default value. This is not possible if the table is not empty.
  - Added the required column `mobileNumber` to the `ReferralForm` table without a default value. This is not possible if the table is not empty.
  - Added the required column `name` to the `ReferralForm` table without a default value. This is not possible if the table is not empty.
  - Added the required column `patientId` to the `ReferralForm` table without a default value. This is not possible if the table is not empty.
  - Added the required column `referralAddress` to the `ReferralForm` table without a default value. This is not possible if the table is not empty.
  - Added the required column `referralEmail` to the `ReferralForm` table without a default value. This is not possible if the table is not empty.
  - Added the required column `referralGDC` to the `ReferralForm` table without a default value. This is not possible if the table is not empty.
  - Added the required column `referralMobileNumber` to the `ReferralForm` table without a default value. This is not possible if the table is not empty.
  - Added the required column `referralName` to the `ReferralForm` table without a default value. This is not possible if the table is not empty.
  - Added the required column `treatMeantAppointment` to the `ReferralForm` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
-- DROP INDEX "ReferralForm_patientEmail_dentistEmail_key";

-- AlterTable
-- ALTER TABLE "Appointment" DROP COLUMN "patienId",
-- ADD COLUMN     "downloadReport" TEXT,
-- ADD COLUMN     "patientId" TEXT NOT NULL,
-- ADD COLUMN     "service" TEXT NOT NULL,
-- ALTER COLUMN "appointmentStatus" DROP NOT NULL;

-- AlterTable
-- ALTER TABLE "Dentist" DROP COLUMN "password",
-- ADD COLUMN     "GDCnumber" TEXT,
-- ADD COLUMN     "address" TEXT,
-- ADD COLUMN     "mobileNumber" TEXT,
-- ADD COLUMN     "name" TEXT,
-- ADD COLUMN     "specialty" TEXT,
-- ADD COLUMN     "userId" TEXT NOT NULL,
-- ADD COLUMN     "yearsOfExperience" INTEGER;

-- AlterTable
-- ALTER TABLE "Patient" DROP COLUMN "password",
-- ADD COLUMN     "address" TEXT,
-- ADD COLUMN     "dateOfBirth" TIMESTAMP(3),
-- ADD COLUMN     "mobileNumber" TEXT,
-- ADD COLUMN     "name" TEXT,
-- ADD COLUMN     "userId" TEXT NOT NULL;

-- AlterTable
-- ALTER TABLE "ReferralForm" DROP COLUMN "attendAppointment",
-- DROP COLUMN "dentistEmail",
-- DROP COLUMN "dentistGCDNumber",
-- DROP COLUMN "dentistMobileNumber",
-- DROP COLUMN "dentistName",
-- DROP COLUMN "pateintMobileNumber",
-- DROP COLUMN "patientAddress",
-- DROP COLUMN "patientDateOfBirth",
-- DROP COLUMN "patientEmail",
-- DROP COLUMN "patientName",
-- DROP COLUMN "referrerDentistId",
-- DROP COLUMN "requiredTreatment",
-- ADD COLUMN     "DOB" TEXT NOT NULL,
-- ADD COLUMN     "address" TEXT NOT NULL,
-- ADD COLUMN     "dentistId" TEXT NOT NULL,
-- ADD COLUMN     "email" TEXT NOT NULL,
-- ADD COLUMN     "mobileNumber" TEXT NOT NULL,
-- ADD COLUMN     "name" TEXT NOT NULL,
-- ADD COLUMN     "other" TEXT,
-- ADD COLUMN     "patientId" TEXT NOT NULL,
-- ADD COLUMN     "referralAddress" TEXT NOT NULL,
-- ADD COLUMN     "referralEmail" TEXT NOT NULL,
-- ADD COLUMN     "referralGDC" TEXT NOT NULL,
-- ADD COLUMN     "referralMobileNumber" TEXT NOT NULL,
-- ADD COLUMN     "referralName" TEXT NOT NULL,
-- ADD COLUMN     "treatMeantAppointment" TEXT NOT NULL,
-- ADD COLUMN     "treatmentDetails" TEXT,
-- ALTER COLUMN "medicalHistory" DROP NOT NULL;

-- CreateTable
-- CREATE TABLE "PatientTreatment" (
--     "id" TEXT NOT NULL,
--     "dentistId" TEXT NOT NULL,
--     "patientId" TEXT NOT NULL,
--     "treatmentId" TEXT NOT NULL,
--     "treatmentDate" TIMESTAMP(3) NOT NULL,
--     "treatmentStatus" TEXT NOT NULL,

--     CONSTRAINT "PatientTreatment_pkey" PRIMARY KEY ("id")
-- );

-- CreateTable
-- CREATE TABLE "Treatment" (
--     "id" TEXT NOT NULL,
--     "name" TEXT NOT NULL,
--     "description" TEXT NOT NULL,
--     "cost" DECIMAL(10,2) NOT NULL,

--     CONSTRAINT "Treatment_pkey" PRIMARY KEY ("id")
-- );

-- -- CreateTable
-- CREATE TABLE "User" (
--     "id" TEXT NOT NULL,
--     "email" TEXT NOT NULL,
--     "password" TEXT NOT NULL,
--     "role" TEXT NOT NULL,

--     CONSTRAINT "User_pkey" PRIMARY KEY ("id")
-- );

-- -- CreateTable
-- CREATE TABLE "Admin" (
--     "id" TEXT NOT NULL,
--     "userId" TEXT NOT NULL,
--     "email" TEXT NOT NULL,

--     CONSTRAINT "Admin_pkey" PRIMARY KEY ("id")
-- );

-- -- CreateTable
-- CREATE TABLE "_PatientDentists" (
--     "A" TEXT NOT NULL,
--     "B" TEXT NOT NULL,

--     CONSTRAINT "_PatientDentists_AB_pkey" PRIMARY KEY ("A","B")
-- );

-- CreateIndex
-- CREATE UNIQUE INDEX "PatientTreatment_patientId_treatmentId_treatmentDate_key" ON "PatientTreatment"("patientId", "treatmentId", "treatmentDate");

-- -- CreateIndex
-- CREATE UNIQUE INDEX "Treatment_name_key" ON "Treatment"("name");

-- -- CreateIndex
-- CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- -- CreateIndex
-- CREATE UNIQUE INDEX "Admin_userId_key" ON "Admin"("userId");

-- -- CreateIndex
-- CREATE UNIQUE INDEX "Admin_email_key" ON "Admin"("email");

-- -- CreateIndex
-- CREATE INDEX "_PatientDentists_B_index" ON "_PatientDentists"("B");

-- -- CreateIndex
-- CREATE UNIQUE INDEX "Appointment_dentistId_patientId_appointmentDate_key" ON "Appointment"("dentistId", "patientId", "appointmentDate");

-- -- CreateIndex
-- CREATE UNIQUE INDEX "Dentist_GDCnumber_key" ON "Dentist"("GDCnumber");

-- -- CreateIndex
-- CREATE UNIQUE INDEX "Dentist_mobileNumber_key" ON "Dentist"("mobileNumber");

-- -- CreateIndex
-- CREATE UNIQUE INDEX "Dentist_userId_key" ON "Dentist"("userId");

-- -- CreateIndex
-- CREATE UNIQUE INDEX "Patient_mobileNumber_key" ON "Patient"("mobileNumber");

-- -- CreateIndex
-- CREATE UNIQUE INDEX "Patient_userId_key" ON "Patient"("userId");

-- -- CreateIndex
-- CREATE UNIQUE INDEX "ReferralForm_patientId_dentistId_key" ON "ReferralForm"("patientId", "dentistId");

-- -- AddForeignKey
-- ALTER TABLE "Patient" ADD CONSTRAINT "Patient_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- -- AddForeignKey
-- ALTER TABLE "Dentist" ADD CONSTRAINT "Dentist_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- -- AddForeignKey
-- ALTER TABLE "ReferralForm" ADD CONSTRAINT "ReferralForm_dentistId_fkey" FOREIGN KEY ("dentistId") REFERENCES "Dentist"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- -- AddForeignKey
-- ALTER TABLE "ReferralForm" ADD CONSTRAINT "ReferralForm_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "Patient"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- -- AddForeignKey
-- ALTER TABLE "Appointment" ADD CONSTRAINT "Appointment_dentistId_fkey" FOREIGN KEY ("dentistId") REFERENCES "Dentist"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- -- AddForeignKey
-- ALTER TABLE "Appointment" ADD CONSTRAINT "Appointment_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "Patient"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- -- AddForeignKey
-- ALTER TABLE "PatientTreatment" ADD CONSTRAINT "PatientTreatment_dentistId_fkey" FOREIGN KEY ("dentistId") REFERENCES "Dentist"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- -- AddForeignKey
-- ALTER TABLE "PatientTreatment" ADD CONSTRAINT "PatientTreatment_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "Patient"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- -- AddForeignKey
-- ALTER TABLE "PatientTreatment" ADD CONSTRAINT "PatientTreatment_treatmentId_fkey" FOREIGN KEY ("treatmentId") REFERENCES "Treatment"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- -- AddForeignKey
-- ALTER TABLE "Admin" ADD CONSTRAINT "Admin_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- -- AddForeignKey
-- ALTER TABLE "_PatientDentists" ADD CONSTRAINT "_PatientDentists_A_fkey" FOREIGN KEY ("A") REFERENCES "Dentist"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- -- AddForeignKey
-- ALTER TABLE "_PatientDentists" ADD CONSTRAINT "_PatientDentists_B_fkey" FOREIGN KEY ("B") REFERENCES "Patient"("id") ON DELETE CASCADE ON UPDATE CASCADE;
