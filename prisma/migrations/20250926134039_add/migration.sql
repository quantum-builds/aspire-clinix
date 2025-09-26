/*
  Warnings:

  - You are about to drop the `_DentistToPractice` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_DentistToPractice" DROP CONSTRAINT "_DentistToPractice_A_fkey";

-- DropForeignKey
ALTER TABLE "_DentistToPractice" DROP CONSTRAINT "_DentistToPractice_B_fkey";

-- DropTable
DROP TABLE "_DentistToPractice";

-- CreateTable
CREATE TABLE "DentistOnPractice" (
    "practiceId" TEXT NOT NULL,
    "dentistId" TEXT NOT NULL,

    CONSTRAINT "DentistOnPractice_pkey" PRIMARY KEY ("practiceId","dentistId")
);

-- AddForeignKey
ALTER TABLE "DentistOnPractice" ADD CONSTRAINT "DentistOnPractice_practiceId_fkey" FOREIGN KEY ("practiceId") REFERENCES "Practice"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DentistOnPractice" ADD CONSTRAINT "DentistOnPractice_dentistId_fkey" FOREIGN KEY ("dentistId") REFERENCES "Dentist"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
