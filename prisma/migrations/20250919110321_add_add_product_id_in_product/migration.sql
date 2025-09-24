/*
  Warnings:

  - A unique constraint covering the columns `[productPaymentId,productId]` on the table `PurchasedProduct` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "PurchasedProduct_patientId_idx";

-- AlterTable
ALTER TABLE "Product" ADD COLUMN     "productId" TEXT;

-- CreateIndex
CREATE INDEX "PurchasedProduct_patientId_productId_idx" ON "PurchasedProduct"("patientId", "productId");

-- CreateIndex
CREATE UNIQUE INDEX "PurchasedProduct_productPaymentId_productId_key" ON "PurchasedProduct"("productPaymentId", "productId");
