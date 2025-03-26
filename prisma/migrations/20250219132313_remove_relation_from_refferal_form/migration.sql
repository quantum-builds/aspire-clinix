/*
  Warnings:

  - The `treatmentStatus` column on the `PatientTreatment` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "PatientTreatmentStatus" AS ENUM ('SCHEDULED', 'PENDING', 'RESCHEDULED', 'ONGOING', 'COMPLETED', 'CANCELED', 'NO_SHOW', 'FAILED', 'EXPIRED');

-- DropForeignKey
ALTER TABLE "ReferralForm" DROP CONSTRAINT "ReferralForm_dentistId_fkey";

-- DropForeignKey
ALTER TABLE "ReferralForm" DROP CONSTRAINT "ReferralForm_patientId_fkey";

-- AlterTable
ALTER TABLE "PatientTreatment" DROP COLUMN "treatmentStatus",
ADD COLUMN     "treatmentStatus" "PatientTreatmentStatus" NOT NULL DEFAULT 'PENDING';
