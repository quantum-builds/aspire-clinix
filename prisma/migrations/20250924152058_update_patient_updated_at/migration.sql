/*
  Warnings:

  - You are about to drop the column `creattedAt` on the `AppointmentRequests` table. All the data in the column will be lost.
  - Added the required column `status` to the `AppointmentRequests` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "AppointmentRequestStatus" AS ENUM ('APPROVED', 'PENDING', 'CANCEL');

-- AlterTable
ALTER TABLE "AppointmentRequests" DROP COLUMN "creattedAt",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "status" "AppointmentRequestStatus" NOT NULL;
