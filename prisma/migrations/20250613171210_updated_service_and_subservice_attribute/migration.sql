-- DropForeignKey
ALTER TABLE "SubService" DROP CONSTRAINT "SubService_serviceId_fkey";

-- AlterTable
ALTER TABLE "Service" ALTER COLUMN "description" DROP NOT NULL;

-- AlterTable
ALTER TABLE "SubService" ALTER COLUMN "description" DROP NOT NULL,
ALTER COLUMN "serviceId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "SubService" ADD CONSTRAINT "SubService_serviceId_fkey" FOREIGN KEY ("serviceId") REFERENCES "Service"("id") ON DELETE SET NULL ON UPDATE CASCADE;
