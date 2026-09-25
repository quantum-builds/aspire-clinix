import Button from "@/app/(dashboards)/components/Button";
import { TPractitioner } from "@/types/common";

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
  const name = `${practitioner.firstName} ${practitioner.lastName}`.trim();

  const selectSlotHref = `/patient/plan-selection/slot-selection?practitionerId=${
    practitioner.id
  }${treatmentId ? `&treatmentId=${encodeURIComponent(treatmentId)}` : ""}${
    duration ? `&duration=${encodeURIComponent(duration)}` : ""
  }`;

  return (
    <div className="flex flex-col rounded-2xl border px-5 py-6 text-left bg-dashboardBarBackground border-green transition hover:border-green-600">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h2 className="font-opus text-2xl font-medium text-dashboardTextBlack">
          {name}
        </h2>

        {practitioner.gdcNumber && (
          <span className="font-gillSans text-sm text-lightBlack">
            {practitioner.gdcNumber}
          </span>
        )}
      </div>

      {practitioner.role && (
        <p className="mt-2 font-gillSans text-base text-lightBlack">
          {practitioner.role}</p>
      )}

      <Button
        text="Select Slot"
        href={selectSlotHref}
        className="ml-auto mt-5 h-10 px-5 py-0 text-base"
      />
    </div>
  );
}
