-- CreateEnum
CREATE TYPE "DentistResponseStatus" AS ENUM ('PENDING', 'ACCEPTED', 'REJECTED');

-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "ReferralRequestStatus" ADD VALUE 'PENDING_REVIEW';
ALTER TYPE "ReferralRequestStatus" ADD VALUE 'ACCEPTED';
ALTER TYPE "ReferralRequestStatus" ADD VALUE 'REJECTED';

-- AlterTable
ALTER TABLE "ReferralRequest" ADD COLUMN     "dentistComments" TEXT,
ADD COLUMN     "dentistResponseStatus" "DentistResponseStatus",
ADD COLUMN     "proposedConsultationTime" TEXT,
ADD COLUMN     "proposedTreatmentDetails" TEXT,
ADD COLUMN     "respondedAt" TIMESTAMP(3);
