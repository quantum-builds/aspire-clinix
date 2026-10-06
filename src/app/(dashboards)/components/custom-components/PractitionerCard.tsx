"use client";

import Button from "@/app/(dashboards)/components/Button";
import { TPractitioner } from "@/types/common";
import { useSearchParams } from "next/navigation";

interface PractitionerCardProps {
  practitioner: TPractitioner;
  treatmentId?: string;
  duration?: string;
}

export default function PractitionerCard({
  practitioner,
  treatmentId,
  duration,
}: PractitionerCardProps) {
  const searchParams = useSearchParams();
  const type = searchParams.get("type");

  const name = `${practitioner.firstName} ${practitioner.lastName}`.trim();

  const selectSlotHref = `/patient/plan-selection/slot-selection?practitionerId=${
    practitioner.id
  }${treatmentId ? `&treatmentId=${encodeURIComponent(treatmentId)}` : ""}${
    duration ? `&duration=${encodeURIComponent(duration)}` : ""
  }${type ? `&type=${type}` : ""}`;

  return (
    <div className="flex flex-col rounded-[28px] border border-[#56493A73] bg-[#12100D] opacity-0.82 px-6 py-8 text-left shadow-[0_30px_50px_-20px_rgba(0,0,0,0.35)] transition hover:border-[var(--wt-amount)]/40 sm:px-8 sm:py-9">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <h2 className="min-w-0 font-[family-name:var(--font-cormorant)] text-[30px] font-normal leading-[36px] tracking-[0.9px] text-[var(--wt-name)] sm:text-[36px] sm:leading-[40px]">
          {name}
        </h2>

        {practitioner.gdcNumber && (
          <span className="font-gillSans text-xs uppercase tracking-[0.18em] text-[var(--wt-amount)] sm:text-sm">
            {practitioner.gdcNumber}
          </span>
        )}
      </div>

      {practitioner.role && (
        <p className="mt-4 font-gillSans text-base leading-7 text-[var(--wt-desc)] sm:text-lg sm:leading-8">
          {practitioner.role}
        </p>
      )}

      <div className="mt-8 h-px w-full bg-white/10" />

      <div className="mt-8 flex justify-end">
        <Button
          text="Select Slot"
          href={selectSlotHref}
          className="!h-9 !w-full !rounded-full !bg-[var(--wt-btn)] !px-6 !py-[10px] !text-sm !font-medium !uppercase !tracking-wide !text-[#0b0a08] hover:!opacity-90 sm:!w-[163.5px]"
        />
      </div>
    </div>
  );
}