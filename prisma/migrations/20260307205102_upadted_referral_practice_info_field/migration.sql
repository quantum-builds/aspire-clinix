/*
  Warnings:

  - You are about to drop the column `referralPracticeId` on the `ReferralForm` table. All the data in the column will be lost.
  - Added the required column `referralPracticeNameAddress` to the `ReferralForm` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "ReferralRequest" DROP CONSTRAINT "ReferralRequest_appointmentId_fkey";

-- DropForeignKey
ALTER TABLE "ReferralRequest" DROP CONSTRAINT "ReferralRequest_assignedDentistId_fkey";

-- AlterTable
ALTER TABLE "Appointment" ADD COLUMN     "referralRequestId" TEXT;

-- AlterTable
ALTER TABLE "ReferralForm" DROP COLUMN "referralPracticeId",
ADD COLUMN     "referralPracticeNameAddress" TEXT NOT NULL;

-- CreateIndex
CREATE INDEX "ReferralForm_patientEmail_idx" ON "ReferralForm"("patientEmail");

-- AddForeignKey
ALTER TABLE "Appointment" ADD CONSTRAINT "Appointment_referralRequestId_fkey" FOREIGN KEY ("referralRequestId") REFERENCES "ReferralRequest"("id") ON DELETE SET NULL ON UPDATE CASCADE;
