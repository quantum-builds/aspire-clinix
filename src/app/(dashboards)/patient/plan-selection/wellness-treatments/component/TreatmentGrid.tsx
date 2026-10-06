import NoContent1 from "@/app/(dashboards)/components/NoContent1";
import TreatmentCard from "@/app/(dashboards)/components/custom-components/TreatmentCard";
import { getTreatments } from "@/services/wellnessTreatments/wellnessTreatmentQuery";
import { Response, TTreatment } from "@/types/common";

interface TreatmentGridProps {
  treatments: TTreatment[];
}

export default async function TreatmentGridWrapper() {
  const response: Response<TTreatment[]> = await getTreatments();

  if (!response.status || !response.data || response.data.length === 0) {
    const text = !response.status
      ? response.message || "Unable to load wellness treatments right now."
      : "No wellness treatments are available right now.";

    return <NoContent1 text={text} />;
  }

  const treatments = response.data;

  return (
    <>
      <TreatmentGrid treatments={treatments} />
    </>
  );
}

export function TreatmentGrid({ treatments }: TreatmentGridProps) {
  return (
    <div className="grid gap-6 text-left">
      {treatments.map((treatment) => (
        <TreatmentCard key={treatment.id} treatment={treatment} />
      ))}
    </div>
  );
}
