-- CreateTable
CREATE TABLE "Appointment" (
    "id" TEXT NOT NULL,
    "dentistId" TEXT NOT NULL,
    "patienId" TEXT NOT NULL,
    "appointmentDate" TIMESTAMP(3) NOT NULL,
    "appointmentStatus" TEXT NOT NULL,

    CONSTRAINT "Appointment_pkey" PRIMARY KEY ("id")
);
