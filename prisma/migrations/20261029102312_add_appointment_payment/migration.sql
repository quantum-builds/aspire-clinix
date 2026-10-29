-- CreateEnum
CREATE TYPE "AppointmentPaymentKind" AS ENUM ('WELLNESS_APPOINTMENT', 'TREATMENT_SESSION');

-- CreateEnum
CREATE TYPE "RefundStatus" AS ENUM ('NONE', 'PENDING', 'REFUNDED', 'FAILED');

-- CreateEnum
CREATE TYPE "CancelledBy" AS ENUM ('PATIENT', 'CLINIC');

-- CreateTable
CREATE TABLE "AppointmentPayment" (
    "id" TEXT NOT NULL,
    "kind" "AppointmentPaymentKind" NOT NULL,
    "dentallyAppointmentId" TEXT,
    "sessionId" TEXT,
    "patientDentallyId" INTEGER NOT NULL,
    "patientId" TEXT,
    "stripeCheckoutSessionId" TEXT NOT NULL,
    "stripePaymentIntentId" TEXT NOT NULL,
    "amount" INTEGER NOT NULL,
    "currency" TEXT NOT NULL,
    "refundStatus" "RefundStatus" NOT NULL DEFAULT 'NONE',
    "stripeRefundId" TEXT,
    "refundReason" TEXT,
    "refundError" TEXT,
    "refundedAt" TIMESTAMP(3),
    "cancelledBy" "CancelledBy",
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AppointmentPayment_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "AppointmentPayment_dentallyAppointmentId_key" ON "AppointmentPayment"("dentallyAppointmentId");

-- CreateIndex
CREATE UNIQUE INDEX "AppointmentPayment_sessionId_key" ON "AppointmentPayment"("sessionId");

-- CreateIndex
CREATE UNIQUE INDEX "AppointmentPayment_stripeCheckoutSessionId_key" ON "AppointmentPayment"("stripeCheckoutSessionId");

-- CreateIndex
CREATE UNIQUE INDEX "AppointmentPayment_stripePaymentIntentId_key" ON "AppointmentPayment"("stripePaymentIntentId");

-- CreateIndex
CREATE UNIQUE INDEX "AppointmentPayment_stripeRefundId_key" ON "AppointmentPayment"("stripeRefundId");

-- CreateIndex
CREATE INDEX "AppointmentPayment_patientId_idx" ON "AppointmentPayment"("patientId");

-- CreateIndex
CREATE INDEX "AppointmentPayment_patientDentallyId_idx" ON "AppointmentPayment"("patientDentallyId");
