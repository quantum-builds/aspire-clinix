/*
  Warnings:

  - You are about to drop the `Doctor` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[mobileNumber]` on the table `Patient` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `Address` to the `Patient` table without a default value. This is not possible if the table is not empty.
  - Added the required column `dateOfBirth` to the `Patient` table without a default value. This is not possible if the table is not empty.
  - Added the required column `mobileNumber` to the `Patient` table without a default value. This is not possible if the table is not empty.
  - Added the required column `name` to the `Patient` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Patient" ADD COLUMN     "Address" TEXT NOT NULL,
ADD COLUMN     "dateOfBirth" TEXT NOT NULL,
ADD COLUMN     "mobileNumber" TEXT NOT NULL,
ADD COLUMN     "name" TEXT NOT NULL;

-- DropTable
DROP TABLE "Doctor";

-- CreateTable
CREATE TABLE "Dentist" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "mobileNumber" TEXT NOT NULL,
    "gdcNumber" TEXT NOT NULL,

    CONSTRAINT "Dentist_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Dentist_email_key" ON "Dentist"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Dentist_mobileNumber_key" ON "Dentist"("mobileNumber");

-- CreateIndex
CREATE UNIQUE INDEX "Dentist_gdcNumber_key" ON "Dentist"("gdcNumber");

-- CreateIndex
CREATE UNIQUE INDEX "Patient_mobileNumber_key" ON "Patient"("mobileNumber");
