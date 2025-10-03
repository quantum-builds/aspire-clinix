/*
  Warnings:

  - You are about to drop the column `referralQequestId` on the `ReferralForm` table. All the data in the column will be lost.
  - You are about to drop the column `treatmeantAppointment` on the `ReferralForm` table. All the data in the column will be lost.
  - Added the required column `attendTreatment` to the `ReferralForm` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "ReferralForm_referralQequestId_key";

-- AlterTable
ALTER TABLE "ReferralForm" DROP COLUMN "referralQequestId",
DROP COLUMN "treatmeantAppointment",
ADD COLUMN     "attendTreatment" BOOLEAN NOT NULL;
