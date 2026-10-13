"use client";

import Link from "next/link";
import { useSession } from "next-auth/react";

export default function WellnessTopActions() {
  const { status } = useSession();
  const isAuthenticated = status === "authenticated";

  return (
    <div className="relative z-20 w-full border-b border-white/5">
      <div className="mx-auto flex w-full max-w-[1400px] flex-col items-center gap-3 px-4 py-3 sm:px-6 lg:flex-row justify-end lg:gap-4 lg:px-8">
        {!isAuthenticated && (
          <>
            <p className="flex items-center gap-2.5 font-gillSans text-xs text-[#A8A196] sm:text-sm">
              <span
                aria-hidden
                className="h-1.5 w-1.5 shrink-0 rounded-full bg-[#8A7458]"
              />
              <span>Already have a plan?</span>
              <Link
                href="/patient/login"
                className="text-[var(--wt-amount)] hover:underline decoration-[var(--wt-amount)]/50 underline-offset-4 transition hover:decoration-[var(--wt-amount)]"
              >
                Sign in to access your discounted prices.
              </Link>
            </p>

            <span
              aria-hidden
              className="hidden h-5 w-px bg-white/15 lg:block"
            />
          </>
        )}

        <div className="flex items-center gap-3">
          {!isAuthenticated && (
            <Link
              href="/patient/login"
              className="flex h-9 items-center justify-center rounded-full border border-white/15 px-5 font-gillSans text-xs font-medium uppercase tracking-wide text-[var(--wt-name)] transition hover:border-[var(--wt-amount)] sm:text-sm"
            >
              Sign in
            </Link>
          )}
          <Link
            href="/patient/plan-selection/plans"
            className="flex h-9 items-center justify-center rounded-full bg-[var(--wt-amount)] px-5 font-gillSans text-xs font-medium uppercase tracking-wide text-[#0B0A08] transition hover:opacity-90 sm:text-sm"
          >
            View plans
          </Link>
        </div>
      </div>
    </div>
  );
}