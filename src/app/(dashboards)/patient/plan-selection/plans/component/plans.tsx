"use client";

import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import BackButton from "@/app/(dashboards)/components/BackButton";
import CustomButton from "@/app/(dashboards)/components/custom-components/CustomButton";
import {
  useBuyPlan,
  useUpgradePlan,
  useCancelUpgrade,
  useCancelMembership,
  useReactivateMembership,
} from "@/services/membership/membershipMutation";
import { getCurrentMembership } from "@/services/membership/membershipQuery";
import { showToast } from "@/utils/defaultToastOptions";

const MEMBERSHIP_PLANS = [
  {
    id: "Essentials",
    name: "Essentials",
    price: "£275",
    features: [
      "Any 4 treatments per month (up to 2 hyperbaric)",
      "VIP access to special events,",
      "1 guest pass",
      "1 complimentary breathwork session",
    ],
  },
  {
    id: "Perform",
    name: "Perform",
    price: "£445",
    features: [
      "Any 8 treatments per month (up to 4 hyperbaric)",
      "VIP access to special events,",
      "2 guest passes",
      "2 complimentary breathwork sessions",
    ],
  },
  {
    id: "Unlimited",
    name: "Unlimited",
    price: "£785",
    features: [
      "Unlimited treatments, with up to 8 hyperbaric sessions per month",
      "VIP access to special events,",
      "3 guest passes",
      "3 complimentary breathwork sessions",
    ],
  },
];

export default function PlansPage() {
  const queryClient = useQueryClient();
  const [loadingPlanId, setLoadingPlanId] = useState<string | null>(null);

  const { data: membershipData, isLoading } = useQuery({
    queryKey: ["currentMembership"],
    queryFn: getCurrentMembership,
  });

  const currentMembership = membershipData?.data || null;

  const { mutate: buyPlan } = useBuyPlan();
  const { mutate: upgradePlan } = useUpgradePlan();
  const { mutate: cancelUpgrade } = useCancelUpgrade();
  const { mutate: cancelMembership } = useCancelMembership();
  const { mutate: reactivateMembership } = useReactivateMembership();

  const handleBuyPlan = (planId: string) => {
    setLoadingPlanId(planId);

    buyPlan(
      { planId },
      {
        onSuccess: (data) => {
          if (data.status && data.data?.checkoutUrl) {
            window.location.href = data.data.checkoutUrl;
          } else {
            console.error("Failed to create checkout session:", data.message);
            setLoadingPlanId(null);
          }
        },
        onError: (error) => {
          console.error("Error buying plan:", error);
          setLoadingPlanId(null);
        },
      },
    );
  };

  const handleUpgradePlan = (planId: string) => {
    setLoadingPlanId(planId);

    upgradePlan(
      { planId },
      {
        onSuccess: (data) => {
          if (data.status) {
            queryClient.invalidateQueries({ queryKey: ["currentMembership"] });
          }
          setLoadingPlanId(null);
        },
        onError: (error) => {
          console.error("Error upgrading plan:", error);
          setLoadingPlanId(null);
        },
      },
    );
  };

  const handleCancelUpgrade = () => {
    setLoadingPlanId("cancel-upgrade");

    cancelUpgrade(undefined, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["currentMembership"] });
        setLoadingPlanId(null);
      },
      onError: (error) => {
        console.error("Error cancelling upgrade:", error);
        setLoadingPlanId(null);
      },
    });
  };

  const handleCancelMembership = () => {
    setLoadingPlanId("cancel-membership");

    cancelMembership(undefined, {
      onSuccess: () => {
        showToast(
          "success",
          "Plan will be cancelled on the next billing date.",
        );
        queryClient.invalidateQueries({ queryKey: ["currentMembership"] });
        setLoadingPlanId(null);
      },
      onError: (error) => {
        console.error("Error cancelling membership:", error);
        setLoadingPlanId(null);
      },
    });
  };

  const handleReactivateMembership = () => {
    setLoadingPlanId("reactivate-membership");

    reactivateMembership(undefined, {
      onSuccess: () => {
        showToast("success", "Membership reactivated successfully.");
        queryClient.invalidateQueries({ queryKey: ["currentMembership"] });
        setLoadingPlanId(null);
      },
      onError: (error) => {
        console.error("Error reactivating membership:", error);
        setLoadingPlanId(null);
      },
    });
  };

  const getButtonText = (planName: string) => {
    if (!currentMembership) return "Buy";

    const isCurrentPlan = currentMembership.currentPlanName === planName;
    const isPendingPlan = currentMembership.pendingPlanName === planName;

    if (isPendingPlan) {
      const currentPlanIndex = MEMBERSHIP_PLANS.findIndex(
        (p) => p.name === currentMembership.currentPlanName,
      );
      const pendingPlanIndex = MEMBERSHIP_PLANS.findIndex(
        (p) => p.name === currentMembership.pendingPlanName,
      );
      const isUpgrade = pendingPlanIndex > currentPlanIndex;
      return isUpgrade ? "Cancel Upgrade" : "Cancel Downgrade";
    }

    if (isCurrentPlan) {
      if (currentMembership.cancelAtPeriodEnd) return "Reactivate";
      return "Cancel";
    }

    const currentPlanIndex = MEMBERSHIP_PLANS.findIndex(
      (p) => p.name === currentMembership.currentPlanName,
    );
    const thisPlanIndex = MEMBERSHIP_PLANS.findIndex(
      (p) => p.name === planName,
    );

    return thisPlanIndex > currentPlanIndex ? "Upgrade" : "Downgrade";
  };

  const handleButtonClick = (planName: string) => {
    if (!currentMembership) {
      handleBuyPlan(planName);
      return;
    }

    const isCurrentPlan = currentMembership.currentPlanName === planName;
    const isPendingPlan = currentMembership.pendingPlanName === planName;

    if (isPendingPlan) {
      handleCancelUpgrade();
    } else if (isCurrentPlan) {
      if (currentMembership.cancelAtPeriodEnd) {
        handleReactivateMembership();
      } else {
        handleCancelMembership();
      }
    } else {
      handleUpgradePlan(planName);
    }
  };

  const isButtonDisabled = (planName: string) => {
    if (isLoading) return true;
    if (loadingPlanId !== null) return true;

    if (!currentMembership) return false;

    const isCurrentPlan = currentMembership.currentPlanName === planName;
    const isPendingPlan = currentMembership.pendingPlanName === planName;

    if (!isCurrentPlan && !isPendingPlan && currentMembership.pendingPlanName) {
      return true;
    }

    return false;
  };

  const getEffectiveDate = () => {
    if (!currentMembership?.currentPeriodEnd) return "";
    const date = new Date(currentMembership.currentPeriodEnd);
    return date.toLocaleDateString("en-GB", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  return (
    <main className="relative overflow-x-hidden px-4 py-14 sm:px-6 lg:px-8">
      <div
        aria-hidden
        className="pointer-events-none absolute left-[-250px] top-0 h-[700px] w-[1100px] bg-[radial-gradient(ellipse_at_center,rgba(214,188,160,0.18)_0%,rgba(255,255,255,0)_65%)]"
      />

      <div className="relative mx-auto w-full max-w-[1000px]">
        <div className="text-center">
          <BackButton />
        </div>

        <section className="w-full pb-16 pt-6 text-center">
          <div className="mx-auto max-w-3xl">
            <h1 className="font-[family-name:var(--font-cormorant)] text-[40px] font-normal leading-[44px] tracking-[-1px] text-[var(--wt-heading)] sm:text-[66px] sm:leading-[66px] sm:tracking-[-1.65px]">
              Membership Plans
            </h1>
            <p className="mx-auto mt-6 max-w-xl font-gillSans text-lg leading-8 text-[var(--wt-desc)] sm:text-xl">
              Choose the membership plan that fits your wellness journey.
            </p>
          </div>

          <div className="mx-auto mt-10 grid max-w-[650px] gap-6 sm:grid-cols-1">
            {MEMBERSHIP_PLANS.map((plan) => {
              const isCurrentPlan =
                currentMembership?.currentPlanName === plan.name;
              const isPendingPlan =
                currentMembership?.pendingPlanName === plan.name;
              const isCancelled =
                isCurrentPlan && currentMembership?.cancelAtPeriodEnd;
              const buttonText = getButtonText(plan.name);
              const isLoadingThis = loadingPlanId === plan.name;
              const disabled = isButtonDisabled(plan.name);

              return (
                <div
                  key={plan.name}
                  className={`relative rounded-[28px] bg-[#12100D]/[0.82] px-6 py-8 text-left shadow-[0_30px_50px_-20px_rgba(0,0,0,0.35)] transition sm:px-8 sm:py-9 ${
                    isCurrentPlan
                      ? "border-2 border-[var(--wt-amount)]"
                      : "border border-[#56493A]/45 hover:border-[var(--wt-amount)]/40"
                  }`}
                >
                  {isCurrentPlan && (
                    <span className="absolute -top-3 right-6 z-10 inline-flex items-center gap-1.5 rounded-full border border-emerald-300/40 bg-emerald-600 px-3.5 py-1 font-gillSans text-xs font-medium uppercase tracking-[0.14em] text-white shadow-[0_6px_16px_-4px_rgba(16,185,129,0.55)]">
                      <span
                        aria-hidden
                        className="h-1.5 w-1.5 rounded-full bg-white"
                      />
                      Active
                    </span>
                  )}
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <h2 className="min-w-0 font-[family-name:var(--font-cormorant)] text-[30px] font-normal leading-[36px] tracking-[0.9px] text-[var(--wt-name)] sm:text-[36px] sm:leading-[40px]">
                      {plan.name}
                    </h2>

                    <p className="flex items-baseline gap-2">
                      <span className="font-[family-name:var(--font-cormorant)] text-[36px] font-normal leading-none text-[var(--wt-amount)] sm:text-[44px]">
                        {plan.price}
                      </span>
                      <span className="font-gillSans text-xs uppercase tracking-[0.18em] text-[var(--wt-desc)] sm:text-sm">
                        / month
                      </span>
                    </p>
                  </div>

                  <ul className="mt-6 space-y-3 font-gillSans text-base leading-7 text-[var(--wt-desc)] sm:text-lg sm:leading-8">
                    {plan.features.map((feature, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <span
                          aria-hidden
                          className="mt-[13px] h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--wt-amount)]"
                        />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>

                  {isCurrentPlan && !isCancelled && (
                    <p className="mt-5 font-gillSans text-xs font-medium uppercase tracking-[0.18em] text-[var(--wt-amount)]">
                      Current Plan
                    </p>
                  )}

                  {isCancelled && (
                    <p className="mt-5 font-gillSans text-sm font-medium text-red-400">
                      Plan will be cancelled on {getEffectiveDate()}
                    </p>
                  )}

                  {isPendingPlan && (
                    <p className="mt-5 font-gillSans text-sm font-medium text-orange-400">
                      {buttonText === "Cancel Upgrade"
                        ? "Upgrade effective"
                        : "Downgrade effective"}{" "}
                      {getEffectiveDate()}
                    </p>
                  )}

                  <div className="mt-8 h-px w-full bg-white/10" />

                  <div className="mt-8 flex justify-end">
                    <CustomButton
                      text={buttonText}
                      style="theme"
                      textSize={14}
                      className="w-full sm:w-[163.5px]"
                      loading={isLoadingThis}
                      disabled={disabled}
                      handleOnClick={() => handleButtonClick(plan.name)}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      </div>
    </main>
  );
}
