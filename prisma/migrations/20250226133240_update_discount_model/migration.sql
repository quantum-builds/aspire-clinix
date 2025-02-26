/*
  Warnings:

  - Made the column `expiresAt` on table `Discount` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Discount" ALTER COLUMN "expiresAt" SET NOT NULL;
