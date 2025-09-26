-- AlterTable
ALTER TABLE "Appointment" ADD COLUMN     "praticeId" TEXT;

-- CreateTable
CREATE TABLE "Practice" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "phoneNumber" TEXT NOT NULL,
    "postcode" TEXT NOT NULL,
    "timeZone" TEXT NOT NULL,
    "town" TEXT NOT NULL,
    "nhs" BOOLEAN NOT NULL DEFAULT false,
    "openingHours" JSONB NOT NULL,
    "addressLine1" TEXT NOT NULL,
    "addressLine2" TEXT NOT NULL,
    "logoUrl" TEXT NOT NULL,

    CONSTRAINT "Practice_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_DentistToPractice" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_DentistToPractice_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE UNIQUE INDEX "Practice_email_key" ON "Practice"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Practice_name_key" ON "Practice"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Practice_phoneNumber_key" ON "Practice"("phoneNumber");

-- CreateIndex
CREATE INDEX "_DentistToPractice_B_index" ON "_DentistToPractice"("B");

-- AddForeignKey
ALTER TABLE "Appointment" ADD CONSTRAINT "Appointment_praticeId_fkey" FOREIGN KEY ("praticeId") REFERENCES "Practice"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_DentistToPractice" ADD CONSTRAINT "_DentistToPractice_A_fkey" FOREIGN KEY ("A") REFERENCES "Dentist"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_DentistToPractice" ADD CONSTRAINT "_DentistToPractice_B_fkey" FOREIGN KEY ("B") REFERENCES "Practice"("id") ON DELETE CASCADE ON UPDATE CASCADE;
