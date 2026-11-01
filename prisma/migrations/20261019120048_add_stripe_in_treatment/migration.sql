/*
  Warnings:

  - A unique constraint covering the columns `[stripePriceId]` on the table `Treatment` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[stripeProductId]` on the table `Treatment` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `stripePriceId` to the `Treatment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `stripeProductId` to the `Treatment` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Treatment" ADD COLUMN     "stripePriceId" TEXT NOT NULL,
ADD COLUMN     "stripeProductId" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Treatment_stripePriceId_key" ON "Treatment"("stripePriceId");

-- CreateIndex
CREATE UNIQUE INDEX "Treatment_stripeProductId_key" ON "Treatment"("stripeProductId");
