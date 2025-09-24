/*
  Warnings:

  - A unique constraint covering the columns `[productId]` on the table `Product` will be added. If there are existing duplicate values, this will fail.
  - Made the column `productId` on table `Product` required. This step will fail if there are existing NULL values in that column.
  - Added the required column `itemId` to the `PurchasedProduct` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "PurchasedProduct" DROP CONSTRAINT "PurchasedProduct_productId_fkey";

-- AlterTable
ALTER TABLE "Product" ALTER COLUMN "productId" SET NOT NULL;

-- AlterTable
ALTER TABLE "PurchasedProduct" ADD COLUMN     "itemId" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Product_productId_key" ON "Product"("productId");

-- AddForeignKey
ALTER TABLE "PurchasedProduct" ADD CONSTRAINT "PurchasedProduct_itemId_fkey" FOREIGN KEY ("itemId") REFERENCES "Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
