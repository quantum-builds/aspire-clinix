/*
  Warnings:

  - A unique constraint covering the columns `[patientEmail,dentistEmail]` on the table `ReferralForm` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `referrerDentistId` to the `ReferralForm` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "ReferralForm_dentistEmail_key";

-- DropIndex
DROP INDEX "ReferralForm_dentistGCDNumber_key";

-- DropIndex
DROP INDEX "ReferralForm_dentistMobileNumber_key";

-- DropIndex
DROP INDEX "ReferralForm_pateintMobileNumber_key";

-- DropIndex
DROP INDEX "ReferralForm_patientEmail_key";

-- AlterTable
ALTER TABLE "ReferralForm" ADD COLUMN     "referrerDentistId" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "ReferralForm_patientEmail_dentistEmail_key" ON "ReferralForm"("patientEmail", "dentistEmail");
