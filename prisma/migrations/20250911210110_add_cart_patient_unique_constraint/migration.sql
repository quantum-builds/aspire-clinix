/*
  Warnings:

  - A unique constraint covering the columns `[patientId]` on the table `Cart` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Cart_patientId_key" ON "Cart"("patientId");
