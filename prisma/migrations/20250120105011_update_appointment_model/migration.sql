-- AlterTable
ALTER TABLE "Appointment" ADD COLUMN     "downloadReport" TEXT,
ADD COLUMN     "service" TEXT[],
ALTER COLUMN "appointmentStatus" DROP NOT NULL;
