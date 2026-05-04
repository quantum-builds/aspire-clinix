-- DropIndex
DROP INDEX "Patient_email_key";

-- AlterTable
ALTER TABLE "Patient" ADD COLUMN     "familyId" TEXT;

-- CreateIndex
CREATE INDEX "Patient_familyId_idx" ON "Patient"("familyId");
