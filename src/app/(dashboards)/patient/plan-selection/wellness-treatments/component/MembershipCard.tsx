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
    <div className="mx-auto mt-8 max-w-[650px] rounded-2xl border border-green p-5 text-left">
      <h2 className="font-opus text-xl font-medium text-dashboardTextBlack">
        Your Plan: {plan.name}
      </h2>

      <div className="mt-4">
        <p className="font-gillSans text-base font-semibold text-dashboardTextBlack">
          Treatments: Total: {getTotal(plan.treatmentLimit)}  Used:{" "}
          {membership.usedTreatments} {" "}
          <span className="text-green">
            {getRemaining(plan.treatmentLimit, membership.usedTreatments)}
          </span>
        </p>

        <ul className="mt-2 ml-4 list-disc font-gillSans text-base text-lightBlack">
          <li>
            Hyperbaric: Total: {getTotal(plan.hyperbaricLimit)}  Used:{" "}
            {membership.usedHyperbaric}{" "}
            <span className="text-green">
              {getRemaining(plan.hyperbaricLimit, membership.usedHyperbaric)}
            </span>
          </li>
        </ul>

        <p className="mt-3 font-gillSans text-base font-semibold text-dashboardTextBlack">
          Breathwork: Total: {getTotal(plan.breathworkLimit)}  Used:{" "}
          {membership.usedBreathwork}{" "}
          <span className="text-green">
            {getRemaining(plan.breathworkLimit, membership.usedBreathwork)}
          </span>
        </p>

        <p className="mt-2 font-gillSans text-base font-semibold text-dashboardTextBlack">
          Guest Passes: Total: {getTotal(plan.guestPassLimit)}  Used:{" "}
          {membership.usedGuestPasses}{" "}
          <span className="text-green">
            {getRemaining(plan.guestPassLimit, membership.usedGuestPasses)}
          </span>
        </p>
      </div>
    </div>
  );
}
