-- AlterTable
ALTER TABLE "ReferralForm" DROP COLUMN "referralDetails",
ADD COLUMN     "cbct" TEXT,
ADD COLUMN     "dentalSpecialty" TEXT;
