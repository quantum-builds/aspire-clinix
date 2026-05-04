/*
  Warnings:

  - You are about to drop the column `patientId` on the `Report` table. All the data in the column will be lost.
  - Added the required column `patientDentallyId` to the `Report` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Report" DROP CONSTRAINT "Report_patientId_fkey";

-- AlterTable
ALTER TABLE "Report" DROP COLUMN "patientId",
ADD COLUMN     "patientDentallyId" TEXT NOT NULL;

-- CreateIndex
CREATE INDEX "Report_patientDentallyId_idx" ON "Report"("patientDentallyId");
