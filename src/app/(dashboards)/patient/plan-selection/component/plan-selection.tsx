"use client";

import { ArrowRight } from "lucide-react";
import Link from "next/link";
import BackButton from "@/app/(dashboards)/components/BackButton";
import { useQuery } from "@tanstack/react-query";
import { getCurrentMembership } from "@/services/membership/membershipQuery";

export default function PlanSelectionPage() {
  const { data: membershipData, isLoading } = useQuery({
    queryKey: ["currentMembership"],
    queryFn: getCurrentMembership,
  });

  const hasActiveMembership =
    !isLoading && membershipData?.data?.status === "ACTIVE";

  const planOptions = [
    ...(hasActiveMembership
      ? [
          {
            title: "Current Plan",
            description: "Book an appointment using your membership plan.",
            href: "/patient/plan-selection/wellness-treatments?type=membership",
          },
        ]
      : []),
    {
      title: "Need to Buy a Plan",
      description: "Purchase a plan to continue.",
      href: "/patient/plan-selection/plans",
    },
    {
      title: "No Current Plan",
      description: "Book a wellness appointment without purchasing a plan.",
      href: "/patient/plan-selection/wellness-treatments",
    },
  ];

  return (
    <main className="relative min-h-screen overflow-hidden bg-[image:var(--wt-page-bg)] px-4 py-20 sm:px-6 lg:px-8">
     
      <div
        aria-hidden
        className="pointer-events-none absolute -left-[210px] top-0 h-[700px] w-[1100px] bg-[radial-gradient(ellipse_at_center,rgba(214,188,160,0.18)_0%,rgba(255,255,255,0)_65%)]"
      />

      />

      <div className="relative mx-auto w-full max-w-[1000px]">
        <div className="text-center">
          <BackButton />
        </div>

        <div className="mx-auto flex min-h-[calc(100vh-10rem)] w-full max-w-4xl items-center justify-center">
          <section className="w-full px-0 pb-16 pt-10 text-center">
            <div className="mx-auto max-w-3xl">
              <h1 className="font-[family-name:var(--font-cormorant)] text-[40px] font-normal leading-[44px] tracking-[-1px] text-[var(--wt-heading)] sm:text-[66px] sm:leading-[66px] sm:tracking-[-1.65px]">
                Plan Selection
              </h1>
              <p className="mx-auto mt-10 max-w-xl font-gillSans text-lg leading-8 text-[var(--wt-desc)] sm:text-xl">
                Choose how you would like to continue with your Wellness
                appointment.
              </p>
            </div>

            <div className="mx-auto mt-12 grid max-w-[650px] gap-6 sm:grid-cols-1">
              {planOptions.map((option) => {
                const cardClassName =
                  "group flex cursor-pointer flex-col items-start rounded-[28px] border border-[#56493A73] bg-[#12100D] opacity-0.82border-white/5 bg-[var(--wt-card)] px-6 py-7 shadow-[0_30px_50px_-20px_rgba(0,0,0,0.35)] transition hover:border-[var(--wt-amount)]/40 sm:px-8 sm:py-8";

                const cardContent = (
                  <div className="flex w-full flex-col gap-3 text-left">
                    <h2 className="flex items-center justify-between gap-2 font-[family-name:var(--font-cormorant)] text-[30px] font-normal leading-[36px] tracking-[0.9px] text-[var(--wt-name)] sm:text-[36px] sm:leading-[40px]">
                      {option.title}
                      <ArrowRight
                        size={24}
                        strokeWidth={1.5}
                        className="shrink-0 text-[var(--wt-amount)] transition-transform group-hover:translate-x-1"
                      />
                    </h2>

                    <p className="font-gillSans text-base leading-7 text-[var(--wt-desc)] sm:text-lg">
                      {option.description}
                    </p>
                  </div>
                );

                if (option.href) {
                  return (
                    <Link
                      key={option.title}
                      href={option.href}
                      className={cardClassName}
                    >
                      {cardContent}
                    </Link>
                  );
                }

                return (
                  <div key={option.title} className={cardClassName}>
                    {cardContent}
                  </div>
                );
              })}
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}