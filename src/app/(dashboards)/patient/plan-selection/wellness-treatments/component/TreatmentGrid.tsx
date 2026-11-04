import { ReactNode } from "react";
import NoContent1 from "@/app/(dashboards)/components/NoContent1";
import TreatmentCard from "@/app/(dashboards)/components/custom-components/TreatmentCard";
import {
  CONTRAST_TREATMENT_IDS,
  HYPERBARIC_TREATMENT_ID,
} from "@/lib/plan-treatment-cost";
import { findPractitionerForTreatment } from "@/lib/wellness-practitioners";
import { getTreatments } from "@/services/wellnessTreatments/wellnessTreatmentQuery";
import { getActivePractitioners } from "@/services/practitioners/practitionerQuery";
import { TTreatment, TPractitioner } from "@/types/common";

interface TreatmentGridProps {
  treatments: TTreatment[];
  practitionerIdByTreatment: Record<number, string | null>;
  children?: ReactNode;
}

export default async function TreatmentGridWrapper({
  children,
}: {
  children?: ReactNode;
}) {
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

    return (
      <>
        <NoContent1 text={text} appointmentFlow={true} />
        <div className="mt-6 empty:hidden">{children}</div>
      </>
    );
  }

  const practitioners: TPractitioner[] =
    practitionersResponse.status && practitionersResponse.data
      ? practitionersResponse.data
      : [];

  const practitionerIdByTreatment: Record<number, string | null> = {};

  for (const treatment of treatments) {
    const practitioner = findPractitionerForTreatment(
      practitioners,
      treatment.id,
    );

    practitionerIdByTreatment[treatment.id] = practitioner
      ? String(practitioner.id)
      : null;
  }

  return (
    <TreatmentGrid
      treatments={treatments}
      practitionerIdByTreatment={practitionerIdByTreatment}
    >
      {children}
    </TreatmentGrid>
  );
}

/**
 * Hyperbaric first, then the other Dentally treatments, then `children`
 * (the admin treatments), then the Contrast Sessions last.
 */
export function TreatmentGrid({
  treatments,
  practitionerIdByTreatment,
  children,
}: TreatmentGridProps) {
  const top = [
    ...treatments.filter((t) => t.id === HYPERBARIC_TREATMENT_ID),
    ...treatments.filter(
      (t) =>
        t.id !== HYPERBARIC_TREATMENT_ID &&
        !CONTRAST_TREATMENT_IDS.includes(t.id),
    ),
  ];

  const contrast = CONTRAST_TREATMENT_IDS.flatMap((id) =>
    treatments.filter((t) => t.id === id),
  );

  const renderCards = (list: TTreatment[]) =>
    list.map((treatment) => (
      <TreatmentCard
        key={treatment.id}
        treatment={treatment}
        practitionerId={practitionerIdByTreatment[treatment.id] ?? null}
      />
    ));

  return (
    <div className="grid gap-6 text-left">
      {renderCards(top)}
      <div className="empty:hidden">{children}</div>
      {renderCards(contrast)}
    </div>
  );
}
