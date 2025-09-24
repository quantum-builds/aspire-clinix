import { Suspense } from "react";
import AppointmentGridWrapper from "./component/AppointmentGrid";
import { AppointmentGridSkeleton } from "./component/skeletons/AppointmentGrid";
import SearchBar from "@/app/(dashboards)/components/SearchBar";
import Pagination from "@/app/(dashboards)/components/Pagination";

export default async function PastAppointments(props: {
  searchParams?: Promise<{
    query?: string;
    page?: string;
  }>;
}) {
  const searchParams = await props.searchParams;
  const query = searchParams?.query || "";
  const page = Number(searchParams?.page) || 1;

  return (
    <div className="min-h-full flex flex-col gap-7 mb-10">
      <div className="flex items-center justify-between">
        <h1 className="font-medium text-3xl">Appointments</h1>
        <div>
          <SearchBar placeholder="Enter Appointment Number" />
        </div>
      </div>
      <Suspense key={query + page} fallback={<AppointmentGridSkeleton />}>
        <AppointmentGridWrapper query={query} page={page} />
      </Suspense>
    </div>
  );
}
