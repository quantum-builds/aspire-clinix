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
      "VIP access to special events, including 1 guest pass",
      "1 complimentary breathwork session",
    ],
  },
  {
    id: "Perform",
    name: "Perform",
    price: "£445",
    features: [
      "Any 8 treatments per month (up to 4 hyperbaric)",
      "VIP access to special events, including 2 guest passes",
      "2 complimentary breathwork sessions",
    ],
  },
  {
    id: "Unlimited",
    name: "Unlimited",
    price: "£785",
    features: [
      "Unlimited treatments, with up to 8 hyperbaric sessions per month",
      "VIP access to special events, including 3 guest passes",
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
        showToast("success", "Plan will be cancelled on the next billing date.");
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
    <main className="min-h-screen  px-4 py-2 sm:px-6 lg:px-8">
      <BackButton />
      <div className="mx-auto flex min-h-[calc(100vh-6rem)] w-full max-w-4xl items-center justify-center">
        <section className="w-full rounded-2xl bg-dashboardBarBackground px-6 py-10 text-center shadow-sm sm:px-10 md:py-14">
          <div className="mx-auto max-w-2xl">
            <h1 className="font-opus text-3xl font-medium text-dashboardTextBlack sm:text-4xl">
              Membership Plans
            </h1>
            <p className="mx-auto mt-4 max-w-xl font-gillSans text-lg text-lightBlack sm:text-xl">
              Choose the membership plan that fits your wellness journey.
            </p>
          </div>

          <div className="mx-auto mt-10 grid max-w-[650px] gap-5 sm:grid-cols-1">
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
                  className={`rounded-2xl border px-5 py-6 text-left transition ${
                    isCurrentPlan
                      ? "border-green border-2"
                      : "border-green hover:border-green-600"
                  }`}
                >
                  <div className="flex flex-wrap items-baseline justify-between gap-2">
                    <h2 className="font-opus text-2xl font-medium text-dashboardTextBlack">
                      {plan.name}
                    </h2>

                    <p className="flex items-baseline gap-1">
                      <span className="text-green font-semibold text-2xl">
                        {plan.price}
                      </span>
                      <span className="font-gillSans text-base text-lightBlack">
                        / month
                      </span>
                    </p>
                  </div>

                  <ul className="list-disc pl-5 font-gillSans text-base text-lightBlack">
                    {plan.features.map((feature, index) => (
                      <li key={index} className="mt-2">
                        {feature}
                      </li>
                    ))}
                  </ul>

                  {isCurrentPlan && !isCancelled && (
                    <p className="mt-2 text-sm font-medium text-green">
                      Current Plan
                    </p>
                  )}

                  {isCancelled && (
                    <p className="mt-2 text-sm font-medium text-red-500">
                      Plan will be cancelled on {getEffectiveDate()}
                    </p>
                  )}

                  {isPendingPlan && (
                    <p className="mt-2 text-sm font-medium text-orange-500">
                      {buttonText === "Cancel Upgrade"
                        ? "Upgrade effective"
                        : "Downgrade effective"}{" "}
                      {getEffectiveDate()}
                    </p>
                  )}

                  <CustomButton
                    text={buttonText}
                    className="ml-auto mt-5 h-10 px-5 py-0 text-base"
                    loading={isLoadingThis}
                    disabled={disabled}
                    handleOnClick={() => handleButtonClick(plan.name)}
                  />
                </div>
              );
            })}
          </div>
        </section>
      </div>
    </main>
  );
}
