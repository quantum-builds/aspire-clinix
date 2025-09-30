import BackButton from "@/app/(dashboards)/components/BackButton";
import { Suspense } from "react";
import AppointmentRequestFormWrapper from "../components/AppointmentRequestFormWrapper";
import { Response } from "@/types/common";
import { TPractice, TPracticeResponse } from "@/types/practice";
import { getPractices } from "@/services/practice/practiceQuery";
import BookAppointmentFormSkeleton from "../components/skeletons/BookAppointmentForm";

export default async function AppointmentRequestFormPage(props: {
  params: { id: string };
  searchParams?: Promise<{
    practiceId?: string;
  }>;
}) {
  const { id } = props.params;
  const searchParams = await props.searchParams;
  const practiceId = searchParams?.practiceId || "";

  const response: Response<TPracticeResponse> = await getPractices({});
  const practices = response.data.practices ?? [];

  return (
    <div className=" w-full h-full flex flex-col gap-7">
      <div className="flex items-center justify-between">
        <h1 className="font-medium text-3xl">Appointments</h1>
        <BackButton />
      </div>
      <Suspense key={id} fallback={<BookAppointmentFormSkeleton />}>
        <AppointmentRequestFormWrapper
          id={id}
          practiceId={practiceId}
          practices={practices}
        />
      </Suspense>
    </div>
  );
}
