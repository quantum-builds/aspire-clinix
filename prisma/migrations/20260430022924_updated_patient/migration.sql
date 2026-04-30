/*
  Warnings:

  - You are about to drop the column `firstName` on the `Patient` table. All the data in the column will be lost.
  - You are about to drop the column `lastName` on the `Patient` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[name]` on the table `Patient` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `name` to the `Patient` table without a default value. This is not possible if the table is not empty.
  - Made the column `mobileNumber` on table `Patient` required. This step will fail if there are existing NULL values in that column.
  - Made the column `dateOfBirth` on table `Patient` required. This step will fail if there are existing NULL values in that column.
  - Made the column `email` on table `Patient` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterEnum
ALTER TYPE "DentistRole" ADD VALUE 'DENTALLY_PRACTITIONER';

-- DropIndex
DROP INDEX "Patient_mobileNumber_firstName_lastName_dateOfBirth_key";

-- AlterTable
ALTER TABLE "Dentist" ADD COLUMN     "role" "DentistRole" NOT NULL DEFAULT 'REFERRING_DENTIST';

-- AlterTable
ALTER TABLE "Patient" DROP COLUMN "firstName",
DROP COLUMN "lastName",
ADD COLUMN     "name" TEXT NOT NULL,
ALTER COLUMN "mobileNumber" SET NOT NULL,
ALTER COLUMN "dateOfBirth" SET NOT NULL,
ALTER COLUMN "email" SET NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Patient_name_key" ON "Patient"("name");
