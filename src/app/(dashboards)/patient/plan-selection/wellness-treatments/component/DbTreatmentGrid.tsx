"use client";

import TreatmentCard from "@/app/(dashboards)/components/custom-components/TreatmentCard";
import { useGetTreatments } from "@/services/treatments/treatmentQuery";
import { TreatmentGridSkeleton } from "./skeletons/TreatmentGridSkeleton";

export default function DbTreatmentGrid() {
  const { data: treatments, isLoading, isError } = useGetTreatments();

  if (isLoading) {
    return <TreatmentGridSkeleton />;
  }

  const activeTreatments = (treatments ?? []).filter(
    (treatment) => treatment.isActive,
  );

  if (isError || activeTreatments.length === 0) {
    return null;
  }

  return (
    <div className="grid gap-6 text-left">
      {activeTreatments.map((treatment) => (
        <TreatmentCard
          key={treatment.id}
          treatment={{
            id: treatment.id,
            name: treatment.name,
            description: treatment.description,
            price: treatment.price,
          }}
          slotsHref={`/patient/plan-selection/wellness-treatments/${treatment.id}/slots`}
        />
      ))}
    </div>
  );
}
