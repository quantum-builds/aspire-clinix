/*
  Warnings:

  - You are about to drop the column `patienId` on the `Appointment` table. All the data in the column will be lost.
  - Added the required column `patientId` to the `Appointment` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Appointment" DROP COLUMN "patienId",
ADD COLUMN     "patientId" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "Treatment" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "cost" DECIMAL(10,2) NOT NULL,

    CONSTRAINT "Treatment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PatientTreatment" (
    "id" TEXT NOT NULL,
    "dentistId" TEXT NOT NULL,
    "patientId" TEXT NOT NULL,
    "treatmentId" TEXT NOT NULL,
    "treatmentDate" TIMESTAMP(3) NOT NULL,
    "treatmentStatus" TEXT NOT NULL,

    CONSTRAINT "PatientTreatment_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Treatment_name_key" ON "Treatment"("name");
