import NoContent1 from "@/app/(dashboards)/components/NoContent1";
import TreatmentCard from "@/app/(dashboards)/components/custom-components/TreatmentCard";
import { findPractitionerForTreatment } from "@/lib/wellness-practitioners";
import { getTreatments } from "@/services/wellnessTreatments/wellnessTreatmentQuery";
import { getActivePractitioners } from "@/services/practitioners/practitionerQuery";
import { TTreatment, TPractitioner } from "@/types/common";

interface TreatmentGridProps {
  treatments: TTreatment[];
  practitionerIdByTreatment: Record<number, string | null>;
}

export default async function TreatmentGridWrapper() {
  const [treatmentsResponse, practitionersResponse] = await Promise.all([
    getTreatments(),
    getActivePractitioners(),
  ]);

  const treatments: TTreatment[] | null =
    treatmentsResponse.status && treatmentsResponse.data
      ? treatmentsResponse.data
      : null;

  if (!treatments || treatments.length === 0) {
    const text = !treatmentsResponse.status
      ? treatmentsResponse.message ||
        "Unable to load wellness treatments right now."
      : "No wellness treatments are available right now.";

    return <NoContent1 text={text} appointmentFlow={true} />;
  }

  const practitioners: TPractitioner[] =
    practitionersResponse.status && practitionersResponse.data
      ? practitionersResponse.data
      : [];

  const practitionerIdByTreatment: Record<number, string | null> = {};

  console.log("Treatments from api:", treatments);
  // console.log("Practitioners:", practitioners);

  for (const treatment of treatments) {
    const practitioner = findPractitionerForTreatment(
      practitioners,
      treatment.id,
    );

    practitionerIdByTreatment[treatment.id] = practitioner
      ? String(practitioner.id)
      : null;

    if (treatment.id === 1367845) {
      console.log("Treatment:", treatment);
      console.log("Practitioner:", practitioner);
    }
  }

  console.log("practitionerIdByTreatment", practitionerIdByTreatment);

  return (
    <TreatmentGrid
      treatments={treatments}
      practitionerIdByTreatment={practitionerIdByTreatment}
    />
  );
}

export function TreatmentGrid({
  treatments,
  practitionerIdByTreatment,
}: TreatmentGridProps) {
  return (
    <div className="grid gap-6 text-left">
      {treatments.map((treatment) => (
        <TreatmentCard
          key={treatment.id}
          treatment={treatment}
          practitionerId={practitionerIdByTreatment[treatment.id] ?? null}
        />
      ))}
    </div>
  );
}
