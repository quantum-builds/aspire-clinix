import { Suspense } from "react";
import BackButton from "@/app/(dashboards)/components/BackButton";
import PractitionerGridWrapper from "./PractitionerGrid";
import { PractitionerGridSkeleton } from "./skeletons/PractitionerGridSkeleton";

interface PractitionersPageProps {
  treatmentId?: string;
  duration?: string;
}

export default function PractitionersPage({
  treatmentId,
  duration,
}: PractitionersPageProps) {
  return (
    <main className="relative  flex justify-center h-full overflow-hidden px-4 py-20 sm:px-6 lg:px-8">
      <div
        aria-hidden
        className="pointer-events-none absolute left-[-250px] top-0 h-[700px] w-[1100px] bg-[radial-gradient(ellipse_at_center,rgba(214,188,160,0.18)_0%,rgba(255,255,255,0)_65%)]"
      />

      <div className="relative mx-auto w-full max-w-[1000px]">
        <div className="text-center">
          <BackButton />
        </div>

        <section className="w-full pt-6 text-center">
          <div className="mx-auto max-w-3xl">
            <h1 className="font-[family-name:var(--font-cormorant)] text-[40px] font-normal leading-[44px] tracking-[-1px] text-[var(--wt-heading)] sm:text-[66px] sm:leading-[66px] sm:tracking-[-1.65px]">
              Book Appointment
            </h1>
            <p className="mx-auto mt-6 max-w-xl font-gillSans text-lg leading-8 text-[var(--wt-desc)] sm:text-xl">
              Select a practitioner to see available slots.
            </p>
          </div>

          <div className="mx-auto mt-8 max-w-[650px]">
            <Suspense fallback={<PractitionerGridSkeleton />}>
              <PractitionerGridWrapper
                treatmentId={treatmentId}
                duration={duration}
              />
            </Suspense>
          </div>
        </section>
      </div>
    </main>
  );
}
