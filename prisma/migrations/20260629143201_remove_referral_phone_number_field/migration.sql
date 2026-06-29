/*
  Warnings:

  - You are about to drop the column `referralPhoneNumber` on the `ReferralForm` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "ReferralForm" DROP COLUMN "referralPhoneNumber",
ADD COLUMN     "prescriptionDetails" TEXT;
