/*
  Warnings:

  - You are about to drop the column `dentistId` on the `ReferralForm` table. All the data in the column will be lost.
  - You are about to drop the column `patientId` on the `ReferralForm` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[patientEmail]` on the table `ReferralForm` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[pateintMobileNumber]` on the table `ReferralForm` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[dentistEmail]` on the table `ReferralForm` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[dentistMobileNumber]` on the table `ReferralForm` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[dentistGCDNumber]` on the table `ReferralForm` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `dentistEmail` to the `ReferralForm` table without a default value. This is not possible if the table is not empty.
  - Added the required column `dentistGCDNumber` to the `ReferralForm` table without a default value. This is not possible if the table is not empty.
  - Added the required column `dentistMobileNumber` to the `ReferralForm` table without a default value. This is not possible if the table is not empty.
  - Added the required column `dentistName` to the `ReferralForm` table without a default value. This is not possible if the table is not empty.
  - Added the required column `pateintMobileNumber` to the `ReferralForm` table without a default value. This is not possible if the table is not empty.
  - Added the required column `patientAddress` to the `ReferralForm` table without a default value. This is not possible if the table is not empty.
  - Added the required column `patientDateOfBirth` to the `ReferralForm` table without a default value. This is not possible if the table is not empty.
  - Added the required column `patientEmail` to the `ReferralForm` table without a default value. This is not possible if the table is not empty.
  - Added the required column `patientName` to the `ReferralForm` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "ReferralForm" DROP CONSTRAINT "ReferralForm_dentistId_fkey";

-- DropForeignKey
ALTER TABLE "ReferralForm" DROP CONSTRAINT "ReferralForm_patientId_fkey";

-- AlterTable
ALTER TABLE "ReferralForm" DROP COLUMN "dentistId",
DROP COLUMN "patientId",
ADD COLUMN     "dentistEmail" TEXT NOT NULL,
ADD COLUMN     "dentistGCDNumber" TEXT NOT NULL,
ADD COLUMN     "dentistMobileNumber" TEXT NOT NULL,
ADD COLUMN     "dentistName" TEXT NOT NULL,
ADD COLUMN     "pateintMobileNumber" TEXT NOT NULL,
ADD COLUMN     "patientAddress" TEXT NOT NULL,
ADD COLUMN     "patientDateOfBirth" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "patientEmail" TEXT NOT NULL,
ADD COLUMN     "patientName" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "ReferralForm_patientEmail_key" ON "ReferralForm"("patientEmail");

-- CreateIndex
CREATE UNIQUE INDEX "ReferralForm_pateintMobileNumber_key" ON "ReferralForm"("pateintMobileNumber");

-- CreateIndex
CREATE UNIQUE INDEX "ReferralForm_dentistEmail_key" ON "ReferralForm"("dentistEmail");

-- CreateIndex
CREATE UNIQUE INDEX "ReferralForm_dentistMobileNumber_key" ON "ReferralForm"("dentistMobileNumber");

-- CreateIndex
CREATE UNIQUE INDEX "ReferralForm_dentistGCDNumber_key" ON "ReferralForm"("dentistGCDNumber");
