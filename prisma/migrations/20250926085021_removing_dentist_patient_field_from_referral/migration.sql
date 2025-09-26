/*
  Warnings:

  - You are about to drop the column `dentistId` on the `ReferralForm` table. All the data in the column will be lost.
  - You are about to drop the column `patientId` on the `ReferralForm` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "ReferralForm_patientId_dentistId_key";

-- AlterTable
ALTER TABLE "ReferralForm" DROP COLUMN "dentistId",
DROP COLUMN "patientId";
