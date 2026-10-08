-- AddForeignKey
ALTER TABLE "PatientMembership" ADD CONSTRAINT "PatientMembership_pendingPlanId_fkey" FOREIGN KEY ("pendingPlanId") REFERENCES "MembershipPlan"("id") ON DELETE SET NULL ON UPDATE CASCADE;
