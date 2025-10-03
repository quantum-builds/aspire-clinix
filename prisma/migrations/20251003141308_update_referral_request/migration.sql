/*
  Warnings:

  - Added the required column `requestStatus` to the `ReferralRequest` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "ReferralRequestStatus" AS ENUM ('ASSIGNED', 'UNASSIGNED');

-- DropForeignKey
ALTER TABLE "ReferralRequest" DROP CONSTRAINT "ReferralRequest_appointmentId_fkey";

-- DropForeignKey
ALTER TABLE "ReferralRequest" DROP CONSTRAINT "ReferralRequest_assignedDentistId_fkey";

-- AlterTable
ALTER TABLE "ReferralRequest" ADD COLUMN     "requestStatus" "ReferralRequestStatus" NOT NULL,
ALTER COLUMN "assignedDentistId" DROP NOT NULL,
ALTER COLUMN "appointmentId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "ReferralRequest" ADD CONSTRAINT "ReferralRequest_assignedDentistId_fkey" FOREIGN KEY ("assignedDentistId") REFERENCES "Dentist"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ReferralRequest" ADD CONSTRAINT "ReferralRequest_appointmentId_fkey" FOREIGN KEY ("appointmentId") REFERENCES "Appointment"("id") ON DELETE SET NULL ON UPDATE CASCADE;
