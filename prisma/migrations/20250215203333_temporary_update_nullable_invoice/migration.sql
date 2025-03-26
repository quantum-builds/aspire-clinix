-- DropForeignKey
ALTER TABLE "Payment" DROP CONSTRAINT "Payment_invoiceId_fkey";

-- DropIndex
DROP INDEX "Payment_invoiceId_key";

-- AlterTable
ALTER TABLE "Payment" ALTER COLUMN "invoiceId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Payment" ADD CONSTRAINT "Payment_invoiceId_fkey" FOREIGN KEY ("invoiceId") REFERENCES "Invoice"("id") ON DELETE SET NULL ON UPDATE CASCADE;
