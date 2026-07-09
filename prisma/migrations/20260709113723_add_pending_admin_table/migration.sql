-- CreateTable
CREATE TABLE "pendingAdmin" (
    "id" TEXT NOT NULL,
    "fullName" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phoneNumber" TEXT NOT NULL,
    "otp" TEXT,
    "otpInvalidationTime" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "password" TEXT NOT NULL,

    CONSTRAINT "pendingAdmin_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "pendingAdmin_email_key" ON "pendingAdmin"("email");

-- CreateIndex
CREATE UNIQUE INDEX "pendingAdmin_phoneNumber_key" ON "pendingAdmin"("phoneNumber");
