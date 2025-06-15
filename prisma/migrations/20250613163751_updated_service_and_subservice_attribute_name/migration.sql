/*
  Warnings:

  - You are about to drop the column `serviceName` on the `Service` table. All the data in the column will be lost.
  - You are about to drop the column `subServiceName` on the `SubService` table. All the data in the column will be lost.
  - Added the required column `name` to the `Service` table without a default value. This is not possible if the table is not empty.
  - Added the required column `name` to the `SubService` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Service" DROP COLUMN "serviceName",
ADD COLUMN     "name" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "SubService" DROP COLUMN "subServiceName",
ADD COLUMN     "name" TEXT NOT NULL;
