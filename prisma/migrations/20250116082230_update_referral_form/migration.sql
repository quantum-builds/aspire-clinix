/*
  Warnings:

  - You are about to drop the column `referrerDentistId` on the `ReferralForm` table. All the data in the column will be lost.
  - You are about to drop the column `requiredTreatment` on the `ReferralForm` table. All the data in the column will be lost.
  - Added the required column `dentistPracticeNameAdrees` to the `ReferralForm` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "ReferralForm" DROP COLUMN "referrerDentistId",
DROP COLUMN "requiredTreatment",
ADD COLUMN     "dentistPracticeNameAdrees" TEXT NOT NULL,
ADD COLUMN     "referralOthers" TEXT,
ADD COLUMN     "treatmentDetails" TEXT;
