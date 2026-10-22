"use client";

import NoContent1 from "@/app/(dashboards)/components/NoContent1";
import { Skeleton } from "@/components/ui/skeleton";
import { useGetTreatment } from "@/services/treatments/treatmentQuery";
import { useParams } from "next/navigation";
import TreatmentForm from "../../../components/TreatmentForm";

export default function EditTreatmentWrapper() {
  const { id } = useParams<{ id: string }>();
  const { data: treatment, isLoading, isError } = useGetTreatment(id);

  if (isLoading) {
    return <Skeleton className="h-[500px] w-full rounded-2xl" />;
  }

  if (isError || !treatment) {
    return <NoContent1 text="Treatment does not exist." />;
  }

  return <TreatmentForm treatment={treatment} />;
}
