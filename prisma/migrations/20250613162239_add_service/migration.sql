/*
  Warnings:

  - Added the required column `serviceId` to the `SubService` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "SubService" ADD COLUMN     "serviceId" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "Service" (
    "id" TEXT NOT NULL,
    "serviceName" TEXT NOT NULL,
    "description" TEXT NOT NULL,

    CONSTRAINT "Service_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "SubService" ADD CONSTRAINT "SubService_serviceId_fkey" FOREIGN KEY ("serviceId") REFERENCES "Service"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
