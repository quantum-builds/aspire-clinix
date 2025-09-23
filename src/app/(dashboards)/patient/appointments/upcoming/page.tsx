import { Suspense } from "react";
import SearchBar from "@/app/(dashboards)/components/SearchBar";
import Button from "@/app/(dashboards)/components/Button";
import AppointmentGridWrapper from "./component/AppointmentGrid";

export default async function UpcomingAppointments(props: {
  searchParams?: Promise<{
    query?: string;
  }>;
}) {
  const searchParams = await props.searchParams;
  const query = searchParams?.query || "";

  return (
    <div>
      <div className=" w-full h-full flex flex-col gap-7">
        <div className="flex items-center justify-between">
          <h1 className="font-medium text-3xl">Appointments</h1>
          <div>
            <SearchBar placeholder="Enter Dentist Name or Appointment Number" />
          </div>
        </div>
        <div className="flex justify-end">
          <Button text="Book an Appointment" href="/patient/appointments/new" />
        </div>
        <Suspense key={query} fallback={<div>Loading.....</div>}>
          <AppointmentGridWrapper query={query} />
        </Suspense>
      </div>
    </div>
  );
}
