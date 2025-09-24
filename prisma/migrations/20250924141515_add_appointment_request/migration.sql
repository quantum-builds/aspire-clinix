-- CreateTable
CREATE TABLE "AppointmentRequests" (
    "id" TEXT NOT NULL,
    "requestedDate" TIMESTAMP(3) NOT NULL,
    "reason" TEXT NOT NULL,
    "note" TEXT,
    "fileUrl" TEXT,

    CONSTRAINT "AppointmentRequests_pkey" PRIMARY KEY ("id")
);
