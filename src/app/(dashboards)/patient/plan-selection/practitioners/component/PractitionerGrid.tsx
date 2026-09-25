import NoContent1 from "@/app/(dashboards)/components/NoContent1";
import PractitionerCard from "@/app/(dashboards)/components/custom-components/PractitionerCard";
import { getActivePractitioners } from "@/services/practitioners/practitionerQuery";
import { Response, TPractitioner } from "@/types/common";

interface PractitionerGridProps {
  practitioners: TPractitioner[];
  treatmentId?: string;
  duration?: string;
}

interface PractitionerGridWrapperProps {
  treatmentId?: string;
  duration?: string;
}

export default async function PractitionerGridWrapper({
  treatmentId,
  duration,
}: PractitionerGridWrapperProps) {
  const response: Response<TPractitioner[]> = await getActivePractitioners();

  if (!response.status || !response.data || response.data.length === 0) {
    const text = !response.status
      ? response.message || "Unable to load practitioners right now."
      : "No practitioners are available right now.";

    return <NoContent1 text={text} />;
  }

  const practitioners = response.data;

  return (
    <>
      <PractitionerGrid
        practitioners={practitioners}
        treatmentId={treatmentId}
        duration={duration}
      />
    </>
  );
}

export function PractitionerGrid({
  practitioners,
  treatmentId,
  duration,
}: PractitionerGridProps) {
  return (
    <div className="grid gap-5 text-left">
      {practitioners.map((practitioner) => (
        <PractitionerCard
          key={practitioner.id}
          practitioner={practitioner}
          treatmentId={treatmentId}
          duration={duration}
        />
      ))}
    </div>
  );
}
