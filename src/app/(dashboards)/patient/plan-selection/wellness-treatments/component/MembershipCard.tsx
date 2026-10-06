"use client";

import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";
import { getCurrentMembership } from "@/services/membership/membershipQuery";

export default function MembershipCard() {
  const searchParams = useSearchParams();
  const isMembership = searchParams.get("type") === "membership";

  const { data: membershipData } = useQuery({
    queryKey: ["currentMembership"],
    queryFn: getCurrentMembership,
    enabled: isMembership,
  });

  const membership = membershipData?.data;
  const plan = membership?.plan;

  if (!isMembership || !membership || !plan) return null;

  const getTotal = (limit: number | null) => {
    return limit === null ? "Unlimited" : limit.toString();
  };

  const getRemaining = (limit: number | null, used: number) => {
    if (limit === null) return "Unlimited remaining";
    const remaining = limit - used;
    return `${remaining} remaining`;
  };

   return (
    <div className="mx-auto mt-8 max-w-[650px] rounded-[28px] bg-[var(--wt-card)] p-6 text-left shadow-[0_30px_50px_-20px_rgba(0,0,0,0.35)]">
      <h2 className="font-[family-name:var(--font-cormorant)] text-3xl font-normal tracking-[0.9px] text-[var(--wt-name)]">
        Your Plan: {plan.name}
      </h2>

      <div className="mt-4">
        <p className="font-gillSans text-base font-semibold text-[var(--wt-name)]">
          Treatments: Total: {getTotal(plan.treatmentLimit)}  Used:{" "}
          {membership.usedTreatments} {" "}
          <span className="text-[var(--wt-amount)]">
            {getRemaining(plan.treatmentLimit, membership.usedTreatments)}
          </span>
        </p>

        <ul className="mt-2 ml-4 list-disc font-gillSans text-base text-[var(--wt-desc)]">
          <li>
            Hyperbaric: Total: {getTotal(plan.hyperbaricLimit)}  Used:{" "}
            {membership.usedHyperbaric}{" "}
            <span className="text-[var(--wt-amount)]">
              {getRemaining(plan.hyperbaricLimit, membership.usedHyperbaric)}
            </span>
          </li>
        </ul>

        <p className="mt-3 font-gillSans text-base font-semibold text-[var(--wt-name)]">
          Breathwork: Total: {getTotal(plan.breathworkLimit)}  Used:{" "}
          {membership.usedBreathwork}{" "}
          <span className="text-[var(--wt-amount)]">
            {getRemaining(plan.breathworkLimit, membership.usedBreathwork)}
          </span>
        </p>

        <p className="mt-2 font-gillSans text-base font-semibold text-[var(--wt-name)]">
          Guest Passes: Total: {getTotal(plan.guestPassLimit)}  Used:{" "}
          {membership.usedGuestPasses}{" "}
          <span className="text-[var(--wt-amount)]">
            {getRemaining(plan.guestPassLimit, membership.usedGuestPasses)}
          </span>
        </p>
      </div>
    </div>
  );
}
