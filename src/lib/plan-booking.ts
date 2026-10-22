import { MembershipPlan, PatientMembership, PrismaClient } from "@prisma/client";
import { stripe } from "@/utils/stripe";
import {
  getTreatmentPlanCost,
  HYPERBARIC_TREATMENT_ID,
} from "./plan-treatment-cost";
import { getSubscriptionPeriod } from "./stripe-period";

export type PlanEligibilityStatus =
  | "OK"
  | "PLAN_LIMIT_REACHED"
  | "HYPERBARIC_LIMIT_REACHED"
  | "NO_ACTIVE_PLAN"
  | "SLOT_TAKEN";

export type MembershipWithPlan = PatientMembership & { plan: MembershipPlan };

export function evaluatePlanEligibility(
  membership: Pick<PatientMembership, "usedTreatments" | "usedHyperbaric">,
  plan: Pick<MembershipPlan, "treatmentLimit" | "hyperbaricLimit">,
  treatmentId: number,
): PlanEligibilityStatus {
  const isHyperbaric = Number(treatmentId) === HYPERBARIC_TREATMENT_ID;
  const cost = getTreatmentPlanCost(Number(treatmentId));

  if (
    isHyperbaric &&
    plan.hyperbaricLimit !== null &&
    membership.usedHyperbaric + 1 > plan.hyperbaricLimit
  ) {
    return "HYPERBARIC_LIMIT_REACHED";
  }

  if (
    plan.treatmentLimit !== null &&
    membership.usedTreatments + cost > plan.treatmentLimit
  ) {
    return "PLAN_LIMIT_REACHED";
  }

  return "OK";
}

export async function syncMembershipPeriod(
  prisma: PrismaClient,
  membership: MembershipWithPlan,
): Promise<MembershipWithPlan> {
  const now = new Date();

  if (now < membership.currentPeriodEnd) {
    return membership;
  }

  try {
    const subscription = await stripe.subscriptions.retrieve(
      membership.stripeSubscriptionId,
    );

    const period = getSubscriptionPeriod(subscription);

    if (!period) {
      throw new Error(
        `Subscription ${membership.stripeSubscriptionId} has no billing period`,
      );
    }

    const { currentPeriodStart, currentPeriodEnd } = period;

    const periodChanged =
      currentPeriodStart.getTime() !== membership.currentPeriodStart.getTime();

    return prisma.patientMembership.update({
      where: { id: membership.id },
      data: {
        currentPeriodStart,
        currentPeriodEnd,
        ...(periodChanged
          ? {
              usedTreatments: 0,
              usedHyperbaric: 0,
              usedBreathwork: 0,
              usedGuestPasses: 0,
            }
          : {}),
      },
      include: { plan: true },
    });
  } catch (error) {
    console.error("Failed to sync membership period from Stripe:", error);

    return prisma.patientMembership.update({
      where: { id: membership.id },
      data: {
        usedTreatments: 0,
        usedHyperbaric: 0,
        usedBreathwork: 0,
        usedGuestPasses: 0,
      },
      include: { plan: true },
    });
  }
}