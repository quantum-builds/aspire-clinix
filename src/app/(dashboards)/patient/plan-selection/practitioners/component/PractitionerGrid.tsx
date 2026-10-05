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

const TREATMENT_PRACTITIONER_NAMES: Record<number, string> = {
  1367621: "cryo chamber",
  1367845: "contrast therapy",
  1367626: "ice bath",
  1367623: "hyperbaric chamber",
  1367624: "red light",
  1367622: "infrared",
};

function getPractitionerForTreatment(
  practitioners: TPractitioner[],
  treatmentId?: string,
) {
  if (!treatmentId) {
    return practitioners;
  }

  const practitionerName = TREATMENT_PRACTITIONER_NAMES[Number(treatmentId)];

  if (!practitionerName) {
    return practitioners;
  }

  const matchingPractitioner = practitioners.find((practitioner) =>
    `${practitioner.firstName} ${practitioner.lastName}`
      .toLowerCase()
      .includes(practitionerName),
  );

  return matchingPractitioner ? [matchingPractitioner] : [];
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

  const practitioners = getPractitionerForTreatment(response.data, treatmentId);

  if (practitioners.length === 0) {
    return (
      <NoContent1 text="No practitioner is available for this treatment." />
    );
  }

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
