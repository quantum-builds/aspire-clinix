"use client";

import Link from "next/link";
import { useSession } from "next-auth/react";

export default function LandingPage() {
  const { data: session, status } = useSession();

  const isLoggedInPatient =
    status === "authenticated" && session?.user?.role === "PATIENT";

  const wellnessHref = isLoggedInPatient
    ? "/patient/plan-selection"
    : "/patient/login?redirectTo=/patient/plan-selection";

  return (
    <main className="absolute inset-0 h-full w-full object-cover">
      <video
        autoPlay
        muted
        loop
        playsInline
        className="absolute inset-0 h-full w-full object-cover"
      >
        <source src="/videos/landing-page-video-1.mp4" type="video/mp4" />
      </video>

      <div
        className="absolute inset-0 z-[1]"
        style={{ backgroundColor: "rgba(11, 10, 8, 0.6)" }}
      />

      <div className="relative z-10 flex h-full items-center justify-center px-4">
        <div className="w-full max-w-2xl rounded-2xl p-6 text-center sm:p-10">
          <h1 className="mb-4 font-[family-name:var(--font-cormorant)] text-[40px] font-normal leading-[44px] tracking-[-1px] text-[#F8F5EE] sm:text-[56px] sm:leading-[60px] sm:tracking-[-1.4px]">
            Book Your Appointment
          </h1>
          <p className="mx-auto mb-10 max-w-md font-gillSans text-lg leading-8 text-[#F8F5EE]  sm:text-xl">
            Would you like to book a Wellness Appointment or a Dental
            Appointment?
          </p>

          <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <Link
              href="https://aspire-dental.portal.dental/"
              className="group relative flex h-14 w-[220px] items-center justify-center overflow-hidden rounded-full bg-[#423C36] font-gillSans text-[20px] font-medium tracking-wide text-white"
            >
              <span className="relative z-10 font-[family-name:var(--font-cormorant)]">
                {/* The circle: anchored to the start of the text */}
                <span
                  aria-hidden
                  className="absolute -left-3 top-1/2 -z-10 h-9 w-9 -translate-y-1/2 rounded-full bg-[#5C554E]
           transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]
           group-hover:scale-[16]"
                />
                Dental Appointment
              </span>
            </Link>

            <Link
              href={wellnessHref}
              className="group relative flex h-14 w-[230px] items-center justify-center overflow-hidden rounded-full bg-[#E3DFD3]  font-gillSans text-[20px] font-medium tracking-wide text-[#0B0A08]"
            >
              <span className="relative z-10 font-[family-name:var(--font-cormorant)]">
                {/* The circle: anchored to the start of the text */}
                <span
                  aria-hidden
                  className="absolute -left-3 top-1/2 -z-10 h-9 w-9 -translate-y-1/2 rounded-full bg-[#C9BCA9]
           transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]
           group-hover:scale-[16]"
                />
                Wellness Appointment
              </span>
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
