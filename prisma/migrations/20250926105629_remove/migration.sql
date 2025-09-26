/*
  Warnings:

  - You are about to drop the column `medicalHistory` on the `ReferralForm` table. All the data in the column will be lost.
  - You are about to drop the column `medicalHistoryPdf` on the `ReferralForm` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "ReferralForm" DROP COLUMN "medicalHistory",
DROP COLUMN "medicalHistoryPdf";
