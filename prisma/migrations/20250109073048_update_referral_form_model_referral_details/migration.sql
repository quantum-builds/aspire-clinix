/*
  Warnings:

  - The `referralDetails` column on the `ReferralForm` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "ReferralForm" DROP COLUMN "referralDetails",
ADD COLUMN     "referralDetails" TEXT[];
