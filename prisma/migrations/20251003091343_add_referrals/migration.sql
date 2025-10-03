/*
  Warnings:

  - You are about to drop the column `DOB` on the `ReferralForm` table. All the data in the column will be lost.
  - You are about to drop the column `address` on the `ReferralForm` table. All the data in the column will be lost.
  - You are about to drop the column `email` on the `ReferralForm` table. All the data in the column will be lost.
  - You are about to drop the column `mobileNumber` on the `ReferralForm` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `ReferralForm` table. All the data in the column will be lost.
  - You are about to drop the column `referralAddress` on the `ReferralForm` table. All the data in the column will be lost.
  - You are about to drop the column `referralMobileNumber` on the `ReferralForm` table. All the data in the column will be lost.
  - You are about to drop the column `treatMeantAppointment` on the `ReferralForm` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[referralQequestId]` on the table `ReferralForm` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `patientAddress` to the `ReferralForm` table without a default value. This is not possible if the table is not empty.
  - Added the required column `patientDateOfBirth` to the `ReferralForm` table without a default value. This is not possible if the table is not empty.
  - Added the required column `patientEmail` to the `ReferralForm` table without a default value. This is not possible if the table is not empty.
  - Added the required column `patientName` to the `ReferralForm` table without a default value. This is not possible if the table is not empty.
  - Added the required column `patientPhoneNumber` to the `ReferralForm` table without a default value. This is not possible if the table is not empty.
  - Added the required column `referralPhoneNumber` to the `ReferralForm` table without a default value. This is not possible if the table is not empty.
  - Added the required column `referralPracticeId` to the `ReferralForm` table without a default value. This is not possible if the table is not empty.
  - Added the required column `referralQequestId` to the `ReferralForm` table without a default value. This is not possible if the table is not empty.
  - Added the required column `treatmeantAppointment` to the `ReferralForm` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "ReferralForm" DROP COLUMN "DOB",
DROP COLUMN "address",
DROP COLUMN "email",
DROP COLUMN "mobileNumber",
DROP COLUMN "name",
DROP COLUMN "referralAddress",
DROP COLUMN "referralMobileNumber",
DROP COLUMN "treatMeantAppointment",
ADD COLUMN     "medicalHistoryPdfUrl" TEXT,
ADD COLUMN     "patientAddress" TEXT NOT NULL,
ADD COLUMN     "patientDateOfBirth" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "patientEmail" TEXT NOT NULL,
ADD COLUMN     "patientId" TEXT,
ADD COLUMN     "patientName" TEXT NOT NULL,
ADD COLUMN     "patientPhoneNumber" TEXT NOT NULL,
ADD COLUMN     "referralDentistId" TEXT,
ADD COLUMN     "referralPhoneNumber" TEXT NOT NULL,
ADD COLUMN     "referralPracticeId" TEXT NOT NULL,
ADD COLUMN     "referralQequestId" TEXT NOT NULL,
ADD COLUMN     "treatmeantAppointment" BOOLEAN NOT NULL;

-- CreateTable
CREATE TABLE "ReferralRequest" (
    "id" TEXT NOT NULL,
    "referralFormId" TEXT NOT NULL,
    "assignedDentistId" TEXT NOT NULL,
    "appointmentId" TEXT NOT NULL,

    CONSTRAINT "ReferralRequest_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ReferralRequest_referralFormId_key" ON "ReferralRequest"("referralFormId");

-- CreateIndex
CREATE UNIQUE INDEX "ReferralRequest_appointmentId_key" ON "ReferralRequest"("appointmentId");

-- CreateIndex
CREATE UNIQUE INDEX "ReferralForm_referralQequestId_key" ON "ReferralForm"("referralQequestId");

-- AddForeignKey
ALTER TABLE "ReferralForm" ADD CONSTRAINT "ReferralForm_referralDentistId_fkey" FOREIGN KEY ("referralDentistId") REFERENCES "Dentist"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ReferralForm" ADD CONSTRAINT "ReferralForm_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "Patient"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ReferralRequest" ADD CONSTRAINT "ReferralRequest_assignedDentistId_fkey" FOREIGN KEY ("assignedDentistId") REFERENCES "Dentist"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ReferralRequest" ADD CONSTRAINT "ReferralRequest_referralFormId_fkey" FOREIGN KEY ("referralFormId") REFERENCES "ReferralForm"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ReferralRequest" ADD CONSTRAINT "ReferralRequest_appointmentId_fkey" FOREIGN KEY ("appointmentId") REFERENCES "Appointment"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
