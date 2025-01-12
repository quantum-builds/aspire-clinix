/*
  Warnings:

  - You are about to drop the column `gdcNumber` on the `Dentist` table. All the data in the column will be lost.
  - You are about to drop the column `mobileNumber` on the `Dentist` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `Dentist` table. All the data in the column will be lost.
  - You are about to drop the column `Address` on the `Patient` table. All the data in the column will be lost.
  - You are about to drop the column `dateOfBirth` on the `Patient` table. All the data in the column will be lost.
  - You are about to drop the column `mobileNumber` on the `Patient` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `Patient` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "Dentist_gdcNumber_key";

-- DropIndex
DROP INDEX "Dentist_mobileNumber_key";

-- DropIndex
DROP INDEX "Patient_mobileNumber_key";

-- AlterTable
ALTER TABLE "Dentist" DROP COLUMN "gdcNumber",
DROP COLUMN "mobileNumber",
DROP COLUMN "name";

-- AlterTable
ALTER TABLE "Patient" DROP COLUMN "Address",
DROP COLUMN "dateOfBirth",
DROP COLUMN "mobileNumber",
DROP COLUMN "name";
