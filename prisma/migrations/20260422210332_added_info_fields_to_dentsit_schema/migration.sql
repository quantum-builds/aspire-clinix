/*
  Warnings:

  - A unique constraint covering the columns `[dentallyId]` on the table `Dentist` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `dentallyId` to the `Dentist` table without a default value. This is not possible if the table is not empty.
  - Added the required column `firstName` to the `Dentist` table without a default value. This is not possible if the table is not empty.
  - Added the required column `lastName` to the `Dentist` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Dentist" ADD COLUMN     "dentallyId" TEXT NOT NULL,
ADD COLUMN     "firstName" TEXT NOT NULL,
ADD COLUMN     "lastName" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Dentist_dentallyId_key" ON "Dentist"("dentallyId");
