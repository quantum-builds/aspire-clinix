/*
  Warnings:

  - The `dentallyId` column on the `Dentist` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Changed the type of `dentallyId` on the `Patient` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "Dentist" DROP COLUMN "dentallyId",
ADD COLUMN     "dentallyId" INTEGER;

-- AlterTable
ALTER TABLE "Patient" DROP COLUMN "dentallyId",
ADD COLUMN     "dentallyId" INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Patient_dentallyId_key" ON "Patient"("dentallyId");
