/*
  Warnings:

  - Changed the type of `dateOfBirth` on the `Patient` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "Patient" DROP COLUMN "dateOfBirth",
ADD COLUMN     "dateOfBirth" TIMESTAMP(3) NOT NULL;

-- CreateTable
CREATE TABLE "ReferralForm" (
    "id" TEXT NOT NULL,
    "patientId" TEXT NOT NULL,
    "dentistId" TEXT NOT NULL,
    "medicalHistory" TEXT NOT NULL,
    "referralDetails" TEXT NOT NULL,
    "requiredTreatment" TEXT NOT NULL,
    "attendAppointment" BOOLEAN NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ReferralForm_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "ReferralForm" ADD CONSTRAINT "ReferralForm_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "Patient"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ReferralForm" ADD CONSTRAINT "ReferralForm_dentistId_fkey" FOREIGN KEY ("dentistId") REFERENCES "Dentist"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
