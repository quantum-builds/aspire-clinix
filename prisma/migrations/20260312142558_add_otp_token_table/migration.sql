-- CreateTable
CREATE TABLE "OtpToken" (
    "id" SERIAL NOT NULL,
    "patientId" TEXT,
    "dentistId" TEXT,
    "otp" VARCHAR(6) NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "used" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "OtpToken_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "OtpToken_patientId_idx" ON "OtpToken"("patientId");

-- CreateIndex
CREATE INDEX "OtpToken_dentistId_idx" ON "OtpToken"("dentistId");
