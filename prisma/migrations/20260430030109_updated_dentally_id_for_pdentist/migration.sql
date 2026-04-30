-- DropIndex
DROP INDEX "Dentist_dentallyId_key";

-- AlterTable
ALTER TABLE "Dentist" ALTER COLUMN "dentallyId" DROP NOT NULL;
