"use client";

import Button from "@/app/(dashboards)/components/Button";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { useSession } from "next-auth/react";

export default function WellnessPage() {
  const { data: session, status } = useSession();

  const isLoggedInPatient =
    status === "authenticated" && session?.user?.role === "PATIENT";

  const wellnessHref = isLoggedInPatient
    ? "/patient/plan-selection"
    : "/patient/login?redirectTo=/patient/plan-selection";

  const BOOKING_OPTIONS = [
    {
      title: "Dental Appointment",
      description: "Book a regular dental appointment.",
      href: "https://aspire-dental.portal.dental/",
    },
    {
      title: "Wellness Appointment",
      description: "Continue to the Wellness experience.",
      href: wellnessHref,
    },
  ];

  return (
    <main className="min-h-screen  px-4 py-2 sm:px-6 lg:px-8">
      <div className="mx-auto flex min-h-[calc(100vh-6rem)] w-full max-w-4xl items-center justify-center">
        <section className="w-full rounded-2xl bg-dashboardBarBackground px-6 py-10 text-center shadow-sm sm:px-10 md:py-14">
          <div className="mx-auto max-w-2xl">
            <h1 className="font-opus text-3xl font-medium text-dashboardTextBlack sm:text-4xl">
              How would you like to book?
            </h1>
            <p className="mx-auto mt-4 max-w-xl font-gillSans text-lg text-lightBlack sm:text-xl">
              Choose between booking a regular Dental appointment or continuing
              to the Wellness Appointment.
            </p>
          </div>

          <div className="mx-auto mt-10 grid max-w-[650px] gap-5 sm:grid-cols-1">
            {BOOKING_OPTIONS.map((option) => (
              <Link
                key={option.title}
                href={option.href}
                className="flex cursor-pointer flex-col items-start gap-5 rounded-2xl border px-5 py-3 border-green transition hover:border-green-600"
              >
                <div>
                  <h2 className="flex items-center gap-2 font-opus text-2xl font-medium text-dashboardTextBlack">
                    {option.title}
                    <ArrowRight size={24} />
                  </h2>

                  <p className="mt-2 font-gillSans text-base text-lightBlack">
                    {option.description}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
