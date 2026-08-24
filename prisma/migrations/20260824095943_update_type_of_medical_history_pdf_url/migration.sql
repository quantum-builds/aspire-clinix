/*
  Warnings:

  - The `medicalHistoryPdfUrl` column on the `ReferralForm` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "ReferralForm" DROP COLUMN "medicalHistoryPdfUrl",
ADD COLUMN     "medicalHistoryPdfUrl" TEXT[];
