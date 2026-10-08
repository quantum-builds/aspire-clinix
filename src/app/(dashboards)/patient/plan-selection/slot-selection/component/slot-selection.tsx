import BackButton from "@/app/(dashboards)/components/BackButton";
import SlotSelection from "./SlotSelection";

interface SlotSelectionPageProps {
  practitionerId?: string;
  treatmentId?: string;
  duration?: string;
}

export default function SlotSelectionShell({
  practitionerId,
  treatmentId,
  duration,
}: SlotSelectionPageProps) {
  return (
    <main className="relative  px-4 py-20 sm:px-6 lg:px-8">
      <div
        aria-hidden
        className="pointer-events-none absolute left-[-250px] top-0 h-[750px] w-[1100px] bg-[radial-gradient(ellipse_at_center,rgba(214,188,160,0.18)_0%,rgba(255,255,255,0)_65%)]"
      />

      <div className="relative mx-auto w-full max-w-[1000px]">
        <div className="text-center">
          <BackButton />
        </div>

        <section className="w-full pb-16 pt-6 text-center">
          <div className="mx-auto max-w-3xl">
            <h1 className="font-[family-name:var(--font-cormorant)] text-[40px] font-normal leading-[44px] tracking-[-1px] text-[var(--wt-heading)] sm:text-[66px] sm:leading-[66px] sm:tracking-[-1.65px]">
              Select a Slot
            </h1>
            <p className="mx-auto mt-6 max-w-xl font-gillSans text-lg leading-8 text-[var(--wt-desc)] sm:text-xl">
              Choose an available date and time for your appointment.
            </p>
          </div>

          <div className="mx-auto mt-8 max-w-[650px] rounded-[28px] border  border-[#56493A73] bg-[#12100D] opacity-0.82 px-6 py-8 shadow-[0_30px_50px_-20px_rgba(0,0,0,0.35)] sm:px-8 sm:py-9">
            <SlotSelection
              practitionerId={practitionerId}
              treatmentId={treatmentId}
              duration={duration}
            />
          </div>
        </section>
      </div>
    </main>
  );
}
