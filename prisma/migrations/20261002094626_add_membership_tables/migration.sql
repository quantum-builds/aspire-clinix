-- CreateEnum
CREATE TYPE "MembershipStatus" AS ENUM ('ACTIVE', 'CANCELLED', 'EXPIRED');

-- CreateTable
CREATE TABLE "Subscription" (
    "id" TEXT NOT NULL,
    "patientId" TEXT NOT NULL,
    "planId" TEXT NOT NULL,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3) NOT NULL,
    "status" "PlanStatus" NOT NULL DEFAULT 'ACTIVE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Subscription_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MembershipPlan" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "stripeProductId" TEXT NOT NULL,
    "stripePriceId" TEXT NOT NULL,
    "treatmentLimit" INTEGER,
    "hyperbaricLimit" INTEGER,
    "breathworkLimit" INTEGER NOT NULL DEFAULT 0,
    "guestPassLimit" INTEGER NOT NULL DEFAULT 0,
    "vipEventAccess" BOOLEAN NOT NULL DEFAULT true,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MembershipPlan_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PatientMembership" (
    "id" TEXT NOT NULL,
    "patientId" TEXT NOT NULL,
    "planId" TEXT NOT NULL,
    "stripeCustomerId" TEXT NOT NULL,
    "stripeSubscriptionId" TEXT NOT NULL,
    "status" "MembershipStatus" NOT NULL DEFAULT 'ACTIVE',
    "currentPeriodStart" TIMESTAMP(3) NOT NULL,
    "currentPeriodEnd" TIMESTAMP(3) NOT NULL,
    "cancelAtPeriodEnd" BOOLEAN NOT NULL DEFAULT false,
    "cancelledAt" TIMESTAMP(3),
    "usedTreatments" INTEGER NOT NULL DEFAULT 0,
    "usedHyperbaric" INTEGER NOT NULL DEFAULT 0,
    "usedBreathwork" INTEGER NOT NULL DEFAULT 0,
    "usedGuestPasses" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PatientMembership_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MembershipAppointment" (
    "id" TEXT NOT NULL,
    "membershipId" TEXT NOT NULL,
    "appointmentId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MembershipAppointment_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Subscription_patientId_key" ON "Subscription"("patientId");

-- CreateIndex
CREATE UNIQUE INDEX "MembershipPlan_name_key" ON "MembershipPlan"("name");

-- CreateIndex
CREATE UNIQUE INDEX "MembershipPlan_stripeProductId_key" ON "MembershipPlan"("stripeProductId");

-- CreateIndex
CREATE UNIQUE INDEX "MembershipPlan_stripePriceId_key" ON "MembershipPlan"("stripePriceId");

-- CreateIndex
CREATE UNIQUE INDEX "PatientMembership_patientId_key" ON "PatientMembership"("patientId");

-- CreateIndex
CREATE UNIQUE INDEX "PatientMembership_stripeSubscriptionId_key" ON "PatientMembership"("stripeSubscriptionId");

-- CreateIndex
CREATE INDEX "PatientMembership_patientId_status_idx" ON "PatientMembership"("patientId", "status");

-- CreateIndex
CREATE INDEX "PatientMembership_planId_idx" ON "PatientMembership"("planId");

-- CreateIndex
CREATE UNIQUE INDEX "MembershipAppointment_appointmentId_key" ON "MembershipAppointment"("appointmentId");

-- CreateIndex
CREATE INDEX "MembershipAppointment_membershipId_idx" ON "MembershipAppointment"("membershipId");

-- AddForeignKey
ALTER TABLE "Subscription" ADD CONSTRAINT "Subscription_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "Patient"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PatientMembership" ADD CONSTRAINT "PatientMembership_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "Patient"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PatientMembership" ADD CONSTRAINT "PatientMembership_planId_fkey" FOREIGN KEY ("planId") REFERENCES "MembershipPlan"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MembershipAppointment" ADD CONSTRAINT "MembershipAppointment_membershipId_fkey" FOREIGN KEY ("membershipId") REFERENCES "PatientMembership"("id") ON DELETE CASCADE ON UPDATE CASCADE;
