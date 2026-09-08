/*
  Warnings:

  - The values [REJECTED] on the enum `ReferralRequestStatus` will be removed. If these variants are still used in the database, this will fail.
  - The `callStatus` column on the `ReferralForm` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "CallStatus" AS ENUM ('PENDING', 'AWAITING', 'REJECTED', 'UNATTENDED', 'CONFIRM');

-- AlterEnum
BEGIN;
CREATE TYPE "ReferralRequestStatus_new" AS ENUM ('UNASSIGNED', 'PENDING_REVIEW', 'ACCEPTED', 'REJECTED_BY_DENTIST', 'ASSIGNED', 'REJECTED_BY_PATIENT');
ALTER TABLE "ReferralRequest" ALTER COLUMN "requestStatus" TYPE "ReferralRequestStatus_new" USING ("requestStatus"::text::"ReferralRequestStatus_new");
ALTER TYPE "ReferralRequestStatus" RENAME TO "ReferralRequestStatus_old";
ALTER TYPE "ReferralRequestStatus_new" RENAME TO "ReferralRequestStatus";
DROP TYPE "public"."ReferralRequestStatus_old";
COMMIT;

-- AlterTable
ALTER TABLE "ReferralForm" DROP COLUMN "callStatus",
ADD COLUMN     "callStatus" "CallStatus";
