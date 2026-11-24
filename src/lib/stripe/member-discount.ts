import prisma from "@/lib/db";
import { MembershipWithPlan, syncMembershipPeriod } from "@/lib/plan-booking";
import { getMemberDiscountPercent } from "@/lib/member-discount";

export interface MemberExtraDiscount {
  couponId: string;
  percent: number;
}

// Returns the Stripe coupon to apply when an Essentials/Perform member buys
// an extra treatment because their plan allowance can't cover it.
// `isLimitReached` decides that for the specific booking flow.
export async function getMemberExtraDiscount(
  patientId: string,
  isLimitReached: (membership: MembershipWithPlan) => boolean,
): Promise<MemberExtraDiscount | null> {
  const membership = await prisma.patientMembership.findFirst({
    where: { patientId, status: "ACTIVE" },
    include: { plan: true },
  });

  if (!membership) return null;

  const percent = getMemberDiscountPercent(membership.plan.name);
  if (percent === null) return null;

  const synced = await syncMembershipPeriod(prisma, membership);
  if (!isLimitReached(synced)) return null;

  const couponId = process.env.STRIPE_MEMBER_EXTRA_COUPON_ID?.trim();

  if (!couponId) {
    console.warn(
      "[MEMBER-DISCOUNT] STRIPE_MEMBER_EXTRA_COUPON_ID is not set; charging full price",
    );
    return null;
  }

  return { couponId, percent };
}
