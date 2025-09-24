import { Suspense } from "react";

import AppointmentGridWrapper from "./component/AppointmentGrid";
import SearchBar from "@/app/(dashboards)/components/SearchBar";
import { AppointmentGridSkeleton } from "./component/skeletons/AppointmentGridSkeelton";
import Button from "@/app/(dashboards)/components/Button";

export default async function UpcomingAppointments(props: {
  searchParams?: Promise<{
    query?: string;
  }>;
}) {
  const searchParams = await props.searchParams;
  const query = searchParams?.query || "";

  return (
    <div className="min-h-full flex flex-col gap-7 mb-10">
      <div className="flex items-center justify-between">
        <h1 className="font-medium text-3xl">Appointments</h1>
        <div>
          <SearchBar placeholder="Enter Appointment Number" />
        </div>
      </div>
      <div className="flex justify-end">
        <Button text="Book an Appointment" href="/patient/appointments/new" />
      </div>
      <Suspense key={query} fallback={<AppointmentGridSkeleton />}>
        <AppointmentGridWrapper query={query} />
      </Suspense>
    </div>
  );
}
