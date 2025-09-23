-- CreateTable
CREATE TABLE "ReferralForm" (
    "id" TEXT NOT NULL,
    "medicalHistory" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "referralDetails" TEXT[],
    "treatmentDetails" TEXT,
    "DOB" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "mobileNumber" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "other" TEXT,
    "referralAddress" TEXT NOT NULL,
    "referralEmail" TEXT NOT NULL,
    "referralGDC" TEXT NOT NULL,
    "referralMobileNumber" TEXT NOT NULL,
    "referralName" TEXT NOT NULL,
    "treatMeantAppointment" TEXT NOT NULL,
    "dentistId" TEXT NOT NULL,
    "patientId" TEXT NOT NULL,

    CONSTRAINT "ReferralForm_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Plan" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "validity" INTEGER NOT NULL,
    "includedTreatments" TEXT[],
    "discountId" TEXT,
    "status" "PlanStatus" NOT NULL DEFAULT 'ACTIVE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Plan_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Discount" (
    "id" TEXT NOT NULL,
    "type" "DiscountType" NOT NULL,
    "value" DOUBLE PRECISION NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Discount_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserSubscribedPlans" (
    "userId" TEXT NOT NULL,
    "planId" TEXT NOT NULL,
    "subscribedAt" TIMESTAMP(3) NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "ReferralForm_patientId_dentistId_key" ON "ReferralForm"("patientId", "dentistId");

-- CreateIndex
CREATE UNIQUE INDEX "UserSubscribedPlans_userId_planId_key" ON "UserSubscribedPlans"("userId", "planId");

-- AddForeignKey
ALTER TABLE "Plan" ADD CONSTRAINT "Plan_discountId_fkey" FOREIGN KEY ("discountId") REFERENCES "Discount"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserSubscribedPlans" ADD CONSTRAINT "UserSubscribedPlans_planId_fkey" FOREIGN KEY ("planId") REFERENCES "Plan"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
