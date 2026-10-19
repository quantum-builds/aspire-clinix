/*
  Warnings:

  - You are about to drop the column `duration` on the `Treatment` table. All the data in the column will be lost.
  - You are about to drop the column `remainingLimit` on the `Treatment` table. All the data in the column will be lost.
  - You are about to drop the column `totalLimit` on the `Treatment` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Treatment" DROP COLUMN "duration",
DROP COLUMN "remainingLimit",
DROP COLUMN "totalLimit";
