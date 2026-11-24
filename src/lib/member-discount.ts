// Member discount on extra (paid) treatments once the plan allowance is used.
// Safe to import from client components: no server-only dependencies.

import {
  getTreatmentPlanCost,
  HYPERBARIC_TREATMENT_ID,
} from "@/lib/plan-treatment-cost";

export const MEMBER_DISCOUNT_PERCENT = 15;

// Plans are identified by name (no tier column). Unlimited is not included.
export const MEMBER_DISCOUNT_PLAN_NAMES = ["Essentials", "Perform"];

export function getMemberDiscountPercent(
  planName: string | null | undefined,
): number | null {
  if (!planName) return null;
  return MEMBER_DISCOUNT_PLAN_NAMES.includes(planName)
    ? MEMBER_DISCOUNT_PERCENT
    : null;
}

// Which plan allowance a treatment uses.
export type PlanAllowanceKind = "breathwork" | "hyperbaric" | "treatment";

export function getPlanAllowanceKind(
  id: number | string,
  name?: string | null,
): PlanAllowanceKind {
  // Same test as isBreathworkTreatment (src/lib/treatment-session.ts).
  if ((name ?? "").toLowerCase().includes("breathwork")) return "breathwork";
  if (Number(id) === HYPERBARIC_TREATMENT_ID) return "hyperbaric";
  return "treatment";
}

// Plan credits a treatment uses: Dentally ids per TREATMENT_PLAN_COST,
// admin treatments (cuid ids) always 1.
export function getPlanAllowanceCost(id: number | string): number {
  const numericId = Number(id);
  return Number.isNaN(numericId) ? 1 : getTreatmentPlanCost(numericId);
}

interface AllowanceUsage {
  usedTreatments: number;
  usedHyperbaric: number;
  usedBreathwork: number;
}

interface AllowanceLimits {
  treatmentLimit: number | null;
  hyperbaricLimit: number | null;
  breathworkLimit: number | null;
}


export function isPlanAllowanceUsed(
  kind: PlanAllowanceKind,
  cost: number,
  usage: AllowanceUsage,
  plan: AllowanceLimits,
): boolean {
  if (kind === "breathwork") {
    return (
      plan.breathworkLimit !== null &&
      usage.usedBreathwork + 1 > plan.breathworkLimit
    );
  }

  const treatmentsUsed =
    plan.treatmentLimit !== null &&
    usage.usedTreatments + cost > plan.treatmentLimit;

  if (kind === "hyperbaric") {
    const hyperbaricUsed =
      plan.hyperbaricLimit !== null &&
      usage.usedHyperbaric + 1 > plan.hyperbaricLimit;
    return hyperbaricUsed || treatmentsUsed;
  }

  return treatmentsUsed;
}

export function applyMemberDiscount(
  price: string | number,
  percent: number,
): string {
  const value = Number(price);
  if (Number.isNaN(value)) return String(price);
  return (Math.round(value * (100 - percent)) / 100).toFixed(2);
}
