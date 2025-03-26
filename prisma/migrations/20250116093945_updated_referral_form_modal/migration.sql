/*
  Warnings:

  - You are about to drop the column `attendAppointment` on the `ReferralForm` table. All the data in the column will be lost.
  - You are about to drop the column `dentistEmail` on the `ReferralForm` table. All the data in the column will be lost.
  - You are about to drop the column `dentistGCDNumber` on the `ReferralForm` table. All the data in the column will be lost.
  - You are about to drop the column `dentistMobileNumber` on the `ReferralForm` table. All the data in the column will be lost.
  - You are about to drop the column `dentistName` on the `ReferralForm` table. All the data in the column will be lost.
  - You are about to drop the column `dentistPracticeNameAdrees` on the `ReferralForm` table. All the data in the column will be lost.
  - You are about to drop the column `pateintMobileNumber` on the `ReferralForm` table. All the data in the column will be lost.
  - You are about to drop the column `patientAddress` on the `ReferralForm` table. All the data in the column will be lost.
  - You are about to drop the column `patientDateOfBirth` on the `ReferralForm` table. All the data in the column will be lost.
  - You are about to drop the column `patientEmail` on the `ReferralForm` table. All the data in the column will be lost.
  - You are about to drop the column `patientName` on the `ReferralForm` table. All the data in the column will be lost.
  - You are about to drop the column `referralOthers` on the `ReferralForm` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[email,referralEmail]` on the table `ReferralForm` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `DOB` to the `ReferralForm` table without a default value. This is not possible if the table is not empty.
  - Added the required column `address` to the `ReferralForm` table without a default value. This is not possible if the table is not empty.
  - Added the required column `email` to the `ReferralForm` table without a default value. This is not possible if the table is not empty.
  - Added the required column `mobileNumber` to the `ReferralForm` table without a default value. This is not possible if the table is not empty.
  - Added the required column `name` to the `ReferralForm` table without a default value. This is not possible if the table is not empty.
  - Added the required column `referralAddress` to the `ReferralForm` table without a default value. This is not possible if the table is not empty.
  - Added the required column `referralEmail` to the `ReferralForm` table without a default value. This is not possible if the table is not empty.
  - Added the required column `referralGDC` to the `ReferralForm` table without a default value. This is not possible if the table is not empty.
  - Added the required column `referralMobileNumber` to the `ReferralForm` table without a default value. This is not possible if the table is not empty.
  - Added the required column `referralName` to the `ReferralForm` table without a default value. This is not possible if the table is not empty.
  - Added the required column `treatMeantAppointment` to the `ReferralForm` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "ReferralForm_patientEmail_dentistEmail_key";

-- AlterTable
ALTER TABLE "ReferralForm" DROP COLUMN "attendAppointment",
DROP COLUMN "dentistEmail",
DROP COLUMN "dentistGCDNumber",
DROP COLUMN "dentistMobileNumber",
DROP COLUMN "dentistName",
DROP COLUMN "dentistPracticeNameAdrees",
DROP COLUMN "pateintMobileNumber",
DROP COLUMN "patientAddress",
DROP COLUMN "patientDateOfBirth",
DROP COLUMN "patientEmail",
DROP COLUMN "patientName",
DROP COLUMN "referralOthers",
ADD COLUMN     "DOB" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "address" TEXT NOT NULL,
ADD COLUMN     "email" TEXT NOT NULL,
ADD COLUMN     "mobileNumber" TEXT NOT NULL,
ADD COLUMN     "name" TEXT NOT NULL,
ADD COLUMN     "other" TEXT,
ADD COLUMN     "referralAddress" TEXT NOT NULL,
ADD COLUMN     "referralEmail" TEXT NOT NULL,
ADD COLUMN     "referralGDC" TEXT NOT NULL,
ADD COLUMN     "referralMobileNumber" TEXT NOT NULL,
ADD COLUMN     "referralName" TEXT NOT NULL,
ADD COLUMN     "treatMeantAppointment" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "ReferralForm_email_referralEmail_key" ON "ReferralForm"("email", "referralEmail");
