import AppointmentRequestPageWrapper from "../../components/BookAppointmentPageWrapper";

export default async function AppointmentRequestFormPage(props: {
  params: { id: string };
  searchParams?: Promise<{
    practiceId?: string;
    showModal?: string;
  }>;
}) {
  const { id } = props.params;
  const searchParams = await props.searchParams;

  return <AppointmentRequestPageWrapper id={id} searchParams={searchParams} />;
}
