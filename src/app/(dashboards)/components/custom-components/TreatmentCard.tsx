"use client";

import Button from "@/app/(dashboards)/components/Button";
import { TTreatment } from "@/types/common";
import { useSearchParams } from "next/navigation";
import { Clock } from "lucide-react";

interface TreatmentCardProps {
  treatment: TTreatment;
}

function parseTreatmentTimes(description: string | null | undefined) {
  if (!description) return { activeTime: null, totalTime: null };

  const activeMatch = description.match(
    /Active treatment time\s*:?\s*(\d+)\s*minutes?/i,
  );
  const totalMatch = description.match(
    /Total experience time\s*:?\s*(\d+)\s*minutes?/i,
  );

  return {
    activeTime: activeMatch ? parseInt(activeMatch[1]) : null,
    totalTime: totalMatch ? parseInt(totalMatch[1]) : null,
  };
}

export default function TreatmentCard({ treatment }: TreatmentCardProps) {
  const searchParams = useSearchParams();
  const type = searchParams.get("type");
  const isMembership = type === "membership";
  const { activeTime, totalTime } = parseTreatmentTimes(treatment.description);

  return (
    <div className="flex flex-col rounded-[28px] border border-[#56493A73] bg-[#12100D] opacity-0.82 px-6 py-8 text-left  transition hover:border-[var(--wt-amount)]/40 sm:px-8 sm:py-9">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <h2 className="min-w-0 font-[family-name:var(--font-cormorant)] text-[30px] font-normal leading-[36px] tracking-[0.9px] text-[var(--wt-name)] sm:text-[36px] sm:leading-[40px]">
          {treatment.name}
        </h2>

        {!isMembership && (treatment.price || treatment.code) && (
          <div className="flex flex-col items-end gap-1 text-right">
            {treatment.price && (
              <span className="font-[family-name:var(--font-cormorant)] text-[36px] font-normal leading-none text-[var(--wt-amount)] sm:text-[44px]">
                £{treatment.price}
              </span>
            )}
          </div>
        )}
      </div>

      {treatment.description && (
        <div
          className="mt-6 font-gillSans text-base leading-7 text-[var(--wt-desc)] sm:text-lg sm:leading-8 [&_p]:m-0 [&_strong]:text-[var(--wt-name)]"
          dangerouslySetInnerHTML={{ __html: treatment.description }}
        />
      )}

      <div className="mt-8 h-px w-full bg-white/10" />

      <div className="mt-8 flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
        {activeTime && totalTime ? (
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-3 font-gillSans text-sm text-[var(--wt-desc)] sm:text-base">
              <Clock
                className="h-5 w-5 shrink-0 text-[var(--wt-name)]"
                strokeWidth={1.5}
              />
              <span>
                Active treatment time:{" "}
                <span className="font-medium text-[var(--wt-name)]">
                  {activeTime} minutes
                </span>
              </span>
            </div>
            <div className="flex items-center gap-3 font-gillSans text-sm text-[var(--wt-desc)] sm:text-base">
              <Clock
                className="h-5 w-5 shrink-0 text-[var(--wt-name)]"
                strokeWidth={1.5}
              />
              <span>
                Total experience time:{" "}
                <span className="font-medium text-[var(--wt-name)]">
                  {totalTime} minutes
                </span>
              </span>
            </div>
          </div>
        ) : treatment.duration ? (
          <div className="flex items-center gap-3 font-gillSans text-sm text-[var(--wt-desc)] sm:text-base">
            <Clock
              className="h-5 w-5 shrink-0 text-[var(--wt-name)]"
              strokeWidth={1.5}
            />
            <span>
              Duration:{" "}
              <span className="font-medium text-[var(--wt-name)]">
                {treatment.duration} minutes
              </span>
            </span>
          </div>
        ) : (
          <span />
        )}

        <Button
          text="Book Treatment"
          className="!h-9 !w-full !rounded-full !bg-[var(--wt-btn)] !px-2 !py-[10px] !text-[10px] !font-medium !uppercase !tracking-wide !text-[#0b0a08] hover:!opacity-90 sm:!w-[163.5px]"
          href={`/patient/plan-selection/practitioners?treatmentId=${treatment.id}${
            treatment.duration ? `&duration=${treatment.duration}` : ""
          }${type ? `&type=${type}` : ""}`}
        />
      </div>
    </div>
  );
}
