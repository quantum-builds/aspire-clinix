/*
  Warnings:

  - You are about to drop the `MembershipAppointment` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "WellnessAppointmentType" AS ENUM ('MEMBERSHIP_APPPOINTMENT', 'SINGLE_APPOINTMENT');

-- DropForeignKey
ALTER TABLE "MembershipAppointment" DROP CONSTRAINT "MembershipAppointment_membershipId_fkey";

-- AlterTable
ALTER TABLE "Session" ADD COLUMN     "status" "AppointmentStatus" NOT NULL DEFAULT 'CONFIRMED';

-- DropTable
DROP TABLE "MembershipAppointment";

-- CreateTable
CREATE TABLE "WellnessAppointment" (
    "id" TEXT NOT NULL,
    "membershipId" TEXT,
    "appointmentId" TEXT NOT NULL,
    "treatmentId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "appointmentType" "WellnessAppointmentType",

    CONSTRAINT "WellnessAppointment_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "WellnessAppointment_appointmentId_key" ON "WellnessAppointment"("appointmentId");

-- CreateIndex
CREATE INDEX "WellnessAppointment_membershipId_idx" ON "WellnessAppointment"("membershipId");

-- AddForeignKey
ALTER TABLE "WellnessAppointment" ADD CONSTRAINT "WellnessAppointment_membershipId_fkey" FOREIGN KEY ("membershipId") REFERENCES "PatientMembership"("id") ON DELETE CASCADE ON UPDATE CASCADE;
