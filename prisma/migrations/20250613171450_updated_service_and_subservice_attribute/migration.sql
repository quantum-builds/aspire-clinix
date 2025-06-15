/*
  Warnings:

  - Made the column `serviceId` on table `SubService` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "SubService" DROP CONSTRAINT "SubService_serviceId_fkey";

-- AlterTable
ALTER TABLE "SubService" ALTER COLUMN "serviceId" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "SubService" ADD CONSTRAINT "SubService_serviceId_fkey" FOREIGN KEY ("serviceId") REFERENCES "Service"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
