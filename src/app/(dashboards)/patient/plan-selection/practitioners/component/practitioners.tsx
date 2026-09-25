import { Suspense } from "react";
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
    <main className="min-h-screen  px-4 py-2 sm:px-6 lg:px-8">
      <div className="mx-auto flex min-h-[calc(100vh-6rem)] w-full max-w-4xl items-center justify-center">
        <section className="w-full rounded-2xl bg-dashboardBarBackground px-6 py-10 text-center shadow-sm sm:px-10 md:py-14">
          <div className="mx-auto max-w-2xl">
            <h1 className="font-opus text-3xl font-medium text-dashboardTextBlack sm:text-4xl">
              Book Appointment
            </h1>
            <p className="mx-auto mt-4 max-w-xl font-gillSans text-lg text-lightBlack sm:text-xl">
              Select a practitioner to see available slots.
            </p>
          </div>

          <div className="mx-auto mt-10 max-w-[650px]">
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
