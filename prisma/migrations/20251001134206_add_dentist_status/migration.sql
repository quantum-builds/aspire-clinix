-- CreateEnum
CREATE TYPE "PracticeApprovalStatus" AS ENUM ('PENDING', 'APPROVED', 'CANCELLED');

-- AlterTable
ALTER TABLE "Dentist" ALTER COLUMN "practiceAddress" DROP NOT NULL;

-- AlterTable
ALTER TABLE "DentistOnPractice" ADD COLUMN     "status" "PracticeApprovalStatus" NOT NULL DEFAULT 'PENDING';
