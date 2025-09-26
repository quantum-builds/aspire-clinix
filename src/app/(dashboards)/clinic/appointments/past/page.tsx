import SearchBar from "@/app/(dashboards)/components/SearchBar";
import { Suspense } from "react";
import DateFilter from "@/app/(dashboards)/components/DateFilter";
import AppointmentGridWrapper from "./components/AppointmentGridWrapper";

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
    <div>
      <div className=" w-full h-full flex flex-col gap-7">
        <div className="flex items-center justify-between">
          <h1 className="font-medium text-3xl">Appointments</h1>
          <div className="flex gap-2">
            <SearchBar placeholder="Enter Patient Name or Appointment Number" />
            <DateFilter />
          </div>
        </div>
        <Suspense key={query + page} fallback={<div>Loading.....</div>}>
          {/* <AppointmentGrid
            appointments={filteredAppointments}
            type="upcoming"
          /> */}
          <AppointmentGridWrapper query={query} page={page} />
        </Suspense>
      </div>
    </div>
  );
}
