"use client";

import NoContent1 from "@/app/(dashboards)/components/NoContent1";
import { SlotSelectionSkeleton } from "@/app/(dashboards)/patient/plan-selection/slot-selection/component/skeletons/SlotSelectionSkeleton";
import { useGetTreatment } from "@/services/treatments/treatmentQuery";
import { TAvailability } from "@/types/treatment";
import { dayLabel } from "@/utils/slotSelectionUtils";
import { ReactNode } from "react";
import { useParams } from "next/navigation";

export default function TreatmentSlots() {
  const { id } = useParams<{ id: string }>();
  const { data: treatment, isLoading, isError } = useGetTreatment(id);

  let slotsContent: ReactNode;

  if (isLoading) {
    slotsContent = <SlotSelectionSkeleton />;
  } else if (isError || !treatment) {
    slotsContent = (
      <NoContent1 text="Treatment not found." appointmentFlow={true} />
    );
  } else if (!treatment.availabilities || treatment.availabilities.length === 0) {
    slotsContent = (
      <NoContent1
        text="No slots available for this treatment yet."
        appointmentFlow={true}
      />
    );
  } else {
    const rows = [...treatment.availabilities]
      .sort(
        (a, b) =>
          a.date.localeCompare(b.date) || a.startTime.localeCompare(b.startTime),
      )
      .reduce<[string, TAvailability[]][]>((groups, slot) => {
        const lastGroup = groups[groups.length - 1];

        if (lastGroup && lastGroup[0] === slot.date) {
          lastGroup[1].push(slot);
        } else {
          groups.push([slot.date, [slot]]);
        }

        return groups;
      }, []);

    slotsContent = (
      <div className="flex w-full flex-col gap-6">
        {rows.map(([dayKey, slots]) => (
          <div key={dayKey} className="text-left">
            <h3 className="mb-3 font-[family-name:var(--font-cormorant)] text-[24px] font-normal leading-[30px] tracking-[0.9px] text-[var(--wt-name)] sm:text-[28px]">
              {dayLabel(dayKey)}
            </h3>

            <div className="flex flex-wrap gap-3">
              {slots.map((slot, index) => (
                <span
                  key={`${slot.startTime}-${slot.finishTime}-${index}`}
                  className="flex items-center justify-center rounded-full border border-white/15 px-4 py-2 font-gillSans text-sm text-[var(--wt-name)]"
                >
                  {slot.startTime} – {slot.finishTime}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <main className="relative  px-4 py-20 sm:px-6 lg:px-8">
      <div
        aria-hidden
        className="pointer-events-none absolute left-[-250px] top-0 h-[750px] w-[1100px] bg-[radial-gradient(ellipse_at_center,rgba(214,188,160,0.18)_0%,rgba(255,255,255,0)_65%)]"
      />

      <div className="relative mx-auto w-full max-w-[1000px]">
        <section className="w-full pb-16 pt-6 text-center">
          <div className="mx-auto max-w-3xl">
            <h1 className="font-[family-name:var(--font-cormorant)] text-[40px] font-normal leading-[44px] tracking-[-1px] text-[var(--wt-heading)] sm:text-[66px] sm:leading-[66px] sm:tracking-[-1.65px]">
              Select a Slot
            </h1>
            <p className="mx-auto mt-6 max-w-xl font-gillSans text-lg leading-8 text-[var(--wt-desc)] sm:text-xl">
              Choose an available date and time for your appointment.
            </p>
            {treatment?.name && (
              <p className="mx-auto mt-2 max-w-xl font-gillSans text-base text-[var(--wt-amount)] sm:text-lg">
                {treatment.name}
              </p>
            )}
          </div>

          <div className="mx-auto mt-8 max-w-[800px] rounded-[28px] border  border-white/15 bg-[#56493A73] opacity-0.82 px-6 py-8 shadow-[0_30px_50px_-20px_rgba(0,0,0,0.35)] sm:px-8 sm:py-9">
            {slotsContent}
          </div>
        </section>
      </div>
    </main>
  );
}
