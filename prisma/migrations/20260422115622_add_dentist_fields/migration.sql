/*
  Warnings:

  - You are about to drop the column `country` on the `Dentist` table. All the data in the column will be lost.
  - You are about to drop the column `dateOfBirth` on the `Dentist` table. All the data in the column will be lost.
  - You are about to drop the column `fileUrl` on the `Dentist` table. All the data in the column will be lost.
  - You are about to drop the column `fullName` on the `Dentist` table. All the data in the column will be lost.
  - You are about to drop the column `gender` on the `Dentist` table. All the data in the column will be lost.
  - You are about to drop the column `password` on the `Dentist` table. All the data in the column will be lost.
  - You are about to drop the column `phoneNumber` on the `Dentist` table. All the data in the column will be lost.
  - You are about to drop the column `practiceAddress` on the `Dentist` table. All the data in the column will be lost.
  - You are about to drop the column `role` on the `Dentist` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "Dentist_phoneNumber_key";

-- AlterTable
ALTER TABLE "Dentist" DROP COLUMN "country",
DROP COLUMN "dateOfBirth",
DROP COLUMN "fileUrl",
DROP COLUMN "fullName",
DROP COLUMN "gender",
DROP COLUMN "password",
DROP COLUMN "phoneNumber",
DROP COLUMN "practiceAddress",
DROP COLUMN "role",
ADD COLUMN     "otp" TEXT,
ADD COLUMN     "otpInvalidationTime" TIMESTAMP(3);

-- CreateTable
CREATE TABLE "Patient" (
    "id" TEXT NOT NULL,
    "uuid" TEXT NOT NULL,
    "mobileNumber" TEXT,
    "firstName" TEXT,
    "lastName" TEXT,
    "dateOfBirth" TEXT,

    CONSTRAINT "Patient_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Patient_uuid_key" ON "Patient"("uuid");

-- CreateIndex
CREATE UNIQUE INDEX "Patient_mobileNumber_firstName_lastName_dateOfBirth_key" ON "Patient"("mobileNumber", "firstName", "lastName", "dateOfBirth");
