/*
  Warnings:

  - You are about to drop the column `praticeId` on the `Appointment` table. All the data in the column will be lost.
  - Added the required column `practiceId` to the `Appointment` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Appointment" DROP CONSTRAINT "Appointment_praticeId_fkey";

-- AlterTable
ALTER TABLE "Appointment" DROP COLUMN "praticeId",
ADD COLUMN     "practiceId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "Appointment" ADD CONSTRAINT "Appointment_practiceId_fkey" FOREIGN KEY ("practiceId") REFERENCES "Practice"("id") ON DELETE CASCADE ON UPDATE CASCADE;
