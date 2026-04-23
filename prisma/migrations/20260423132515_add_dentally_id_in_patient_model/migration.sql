/*
  Warnings:

  - A unique constraint covering the columns `[dentallyId]` on the table `Patient` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `dentallyId` to the `Patient` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Patient" ADD COLUMN     "dentallyId" TEXT NOT NULL,
ADD COLUMN     "otp" TEXT,
ADD COLUMN     "otpInvalidationTime" TIMESTAMP(3);

-- CreateIndex
CREATE UNIQUE INDEX "Patient_dentallyId_key" ON "Patient"("dentallyId");
