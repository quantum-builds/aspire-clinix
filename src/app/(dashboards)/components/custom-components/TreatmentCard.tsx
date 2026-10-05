"use client";

import Button from "@/app/(dashboards)/components/Button";
import { TTreatment } from "@/types/common";
import { useSearchParams } from "next/navigation";

interface TreatmentCardProps {
  treatment: TTreatment;
}

export default function TreatmentCard({ treatment }: TreatmentCardProps) {
  const searchParams = useSearchParams();
  const type = searchParams.get("type");
  const isMembership = type === "membership";

  return (
    <div className="flex flex-col rounded-2xl border px-5 py-6 text-left bg-dashboardBarBackground border-green transition hover:border-green-600">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h2 className="font-opus text-2xl font-medium text-dashboardTextBlack">
          {treatment.name}
        </h2>

        {!isMembership && (treatment.price || treatment.code) && (
          <div className="flex flex-col items-end gap-1 text-right">
            {treatment.price && (
              <span className="text-green font-semibold text-2xl">
                £{treatment.price}
              </span>
            )}
          </div>
        )}
      </div>

      {treatment.description && (
        <div
          className="mt-2 font-gillSans text-base text-lightBlack"
          dangerouslySetInnerHTML={{ __html: treatment.description }}
        />
      )}

      <Button
        text="Book Treatment"
        className="ml-auto mt-5 h-10 px-5 py-0 text-base"
        href={`/patient/plan-selection/practitioners?treatmentId=${treatment.id}${
          treatment.duration ? `&duration=${treatment.duration}` : ""
        }${type ? `&type=${type}` : ""}`}
      />
    </div>
  );
}
