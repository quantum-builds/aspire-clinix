/*
  Warnings:

  - You are about to drop the column `password` on the `Dentist` table. All the data in the column will be lost.
  - You are about to drop the column `password` on the `Patient` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[userId]` on the table `Dentist` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[GDCnumber]` on the table `Dentist` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[userId]` on the table `Patient` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[mobileNumber]` on the table `Patient` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[patientId,dentistId]` on the table `ReferralForm` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `userId` to the `Dentist` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `Patient` table without a default value. This is not possible if the table is not empty.
  - Added the required column `dentistId` to the `ReferralForm` table without a default value. This is not possible if the table is not empty.
  - Added the required column `patientId` to the `ReferralForm` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "ReferralForm_email_referralEmail_key";

-- AlterTable
ALTER TABLE "Dentist" DROP COLUMN "password",
ADD COLUMN     "GDCnumber" TEXT,
ADD COLUMN     "address" TEXT,
ADD COLUMN     "mobileNumber" TEXT,
ADD COLUMN     "name" TEXT,
ADD COLUMN     "specialty" TEXT,
ADD COLUMN     "userId" TEXT NOT NULL,
ADD COLUMN     "yearsOfExperience" INTEGER,
ALTER COLUMN "email" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Patient" DROP COLUMN "password",
ADD COLUMN     "address" TEXT,
ADD COLUMN     "dateOfBirth" TIMESTAMP(3),
ADD COLUMN     "mobileNumber" TEXT,
ADD COLUMN     "name" TEXT,
ADD COLUMN     "userId" TEXT NOT NULL,
ALTER COLUMN "email" DROP NOT NULL;

-- AlterTable
ALTER TABLE "ReferralForm" ADD COLUMN     "dentistId" TEXT NOT NULL,
ADD COLUMN     "patientId" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "_PatientDentists" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_PatientDentists_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_PatientDentists_B_index" ON "_PatientDentists"("B");

-- CreateIndex
CREATE UNIQUE INDEX "Dentist_userId_key" ON "Dentist"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Dentist_GDCnumber_key" ON "Dentist"("GDCnumber");

-- CreateIndex
CREATE UNIQUE INDEX "Patient_userId_key" ON "Patient"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Patient_mobileNumber_key" ON "Patient"("mobileNumber");

-- CreateIndex
CREATE UNIQUE INDEX "ReferralForm_patientId_dentistId_key" ON "ReferralForm"("patientId", "dentistId");

-- AddForeignKey
ALTER TABLE "Patient" ADD CONSTRAINT "Patient_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Dentist" ADD CONSTRAINT "Dentist_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ReferralForm" ADD CONSTRAINT "ReferralForm_dentistId_fkey" FOREIGN KEY ("dentistId") REFERENCES "Dentist"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ReferralForm" ADD CONSTRAINT "ReferralForm_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "Patient"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Appointment" ADD CONSTRAINT "Appointment_dentistId_fkey" FOREIGN KEY ("dentistId") REFERENCES "Dentist"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Appointment" ADD CONSTRAINT "Appointment_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "Patient"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PatientTreatment" ADD CONSTRAINT "PatientTreatment_treatmentId_fkey" FOREIGN KEY ("treatmentId") REFERENCES "Treatment"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PatientTreatment" ADD CONSTRAINT "PatientTreatment_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "Patient"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PatientTreatment" ADD CONSTRAINT "PatientTreatment_dentistId_fkey" FOREIGN KEY ("dentistId") REFERENCES "Dentist"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_PatientDentists" ADD CONSTRAINT "_PatientDentists_A_fkey" FOREIGN KEY ("A") REFERENCES "Dentist"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_PatientDentists" ADD CONSTRAINT "_PatientDentists_B_fkey" FOREIGN KEY ("B") REFERENCES "Patient"("id") ON DELETE CASCADE ON UPDATE CASCADE;
