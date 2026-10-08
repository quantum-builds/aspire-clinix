-- CreateTable
CREATE TABLE "TreatmentStripe" (
    "treatmentId" INTEGER NOT NULL,
    "stripePriceId" TEXT NOT NULL,
    "stripeProductId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TreatmentStripe_pkey" PRIMARY KEY ("treatmentId")
);

-- CreateIndex
CREATE UNIQUE INDEX "TreatmentStripe_stripePriceId_key" ON "TreatmentStripe"("stripePriceId");

-- CreateIndex
CREATE UNIQUE INDEX "TreatmentStripe_stripeProductId_key" ON "TreatmentStripe"("stripeProductId");
