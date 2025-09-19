/*
  Warnings:

  - You are about to drop the column `passsword` on the `Dentist` table. All the data in the column will be lost.
  - You are about to drop the column `passsword` on the `Patient` table. All the data in the column will be lost.
  - Added the required column `password` to the `Dentist` table without a default value. This is not possible if the table is not empty.
  - Added the required column `password` to the `Patient` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Dentist" DROP COLUMN "passsword",
ADD COLUMN     "password" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Patient" DROP COLUMN "passsword",
ADD COLUMN     "password" TEXT NOT NULL;
