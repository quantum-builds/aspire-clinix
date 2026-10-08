import { Suspense } from "react";
import BackButton from "@/app/(dashboards)/components/BackButton";
import MembershipCard from "./MembershipCard";
import TreatmentGridWrapper from "./TreatmentGrid";
import { TreatmentGridSkeleton } from "./skeletons/TreatmentGridSkeleton";

function MembershipCardWrapper() {
  return (
    <Suspense fallback={null}>
      <MembershipCard />
    </Suspense>
  );
}

export default function WellnessTreatmentsPage() {
  return (
    <main className="relative min-h-screen overflow-hidden  px-4 py-20 sm:px-6 lg:px-8">
      <div
        aria-hidden
        className="pointer-events-none absolute left-[-250px] top-0 h-[700px] w-[1100px] bg-[radial-gradient(ellipse_at_center,rgba(214,188,160,0.18)_0%,rgba(255,255,255,0)_65%)]"
      />

      <div className="relative mx-auto w-full max-w-[1000px]">
        <div className="text-center">
          <BackButton />
        </div>

        <section className="w-full px-0 pb-16 pt-10 text-center">
          <div className="mx-auto max-w-3xl">
            <h1 className="font-[family-name:var(--font-cormorant)] text-[40px] font-normal leading-[44px] tracking-[-1px] text-[var(--wt-heading)] sm:text-[66px] sm:leading-[66px] sm:tracking-[-1.65px]">
              Wellness Treatments
            </h1>
            <p className="mx-auto mt-10 max-w-3xl font-gillSans text-lg leading-8 text-[var(--wt-desc)] sm:text-xl">
              Book a wellness treatment without a membership plan. Individual,
              non-invasive therapeutic sessions engineered for cellular reset
              and vitality.
            </p>
          </div>

          <MembershipCardWrapper />

          <div className="mx-auto mt-10 w-full">
            <Suspense fallback={<TreatmentGridSkeleton />}>
              <TreatmentGridWrapper />
            </Suspense>
          </div>
        </section>
      </div>
    </main>
  );
}
