import { Suspense } from "react";
import AppointmentRequestPageWrapper from "../../components/BookAppointmentPageWrapper";
import BookAppointmentFormSkeleton from "../components/skeletons/BookAppointmentForm";

export default async function AppointmentRequestFormPage(props: {
  params: { id: string };
  searchParams?: Promise<{
    practiceId?: string;
    showModal?: string;
  }>;
}) {
  const { id } = props.params;
  const searchParams = await props.searchParams;

  return <Suspense key={id} fallback={<BookAppointmentFormSkeleton/> }>

    <AppointmentRequestPageWrapper id={id} searchParams={searchParams} />;
  </Suspense>
}
