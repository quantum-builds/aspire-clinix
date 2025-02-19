/*
  Warnings:

  - You are about to drop the column `name` on the `Video` table. All the data in the column will be lost.
  - You are about to drop the column `type` on the `Video` table. All the data in the column will be lost.
  - Added the required column `fileContent` to the `Video` table without a default value. This is not possible if the table is not empty.
  - Added the required column `fileName` to the `Video` table without a default value. This is not possible if the table is not empty.
  - Added the required column `fileType` to the `Video` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Video" DROP COLUMN "name",
DROP COLUMN "type",
ADD COLUMN     "fileContent" TEXT NOT NULL,
ADD COLUMN     "fileName" TEXT NOT NULL,
ADD COLUMN     "fileType" TEXT NOT NULL;
