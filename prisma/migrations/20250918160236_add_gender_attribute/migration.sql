/*
  Warnings:

  - Added the required column `gender` to the `Dentist` table without a default value. This is not possible if the table is not empty.
  - Added the required column `gender` to the `Patient` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Dentist" ADD COLUMN     "gender" "GenderType" NOT NULL;

-- AlterTable
ALTER TABLE "Patient" ADD COLUMN     "gender" "GenderType" NOT NULL;
