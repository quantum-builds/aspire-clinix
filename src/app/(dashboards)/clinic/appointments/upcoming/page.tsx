import { Suspense } from "react";
import AppointmentGridWrapper from "./components/AppointmentGridWrapper";
import PageTopBar from "@/app/(dashboards)/components/custom-components/PageTopBar";

export default async function UpcomingAppointments(props: {
  searchParams?: Promise<{
    query?: string;
    page?: string;
  }>;
}) {
  const searchParams = await props.searchParams;
  const query = searchParams?.query || "";
  const page = Number(searchParams?.page) || 1;

  return (
    <div className="min-h-full flex flex-col gap-5 mb-10">
      <PageTopBar
        pageHeading="Appointments"
        showSearch={true}
        showFilters={true}
      />
      <Suspense key={query + page} fallback={<div>Loading.....</div>}>
        <AppointmentGridWrapper query={query} page={page} />
      </Suspense>
    </div>
  );
}
