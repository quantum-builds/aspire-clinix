import { Suspense } from "react";

import AppointmentGridWrapper from "./component/AppointmentGrid";
import { AppointmentGridSkeleton } from "./component/skeletons/AppointmentGridSkeelton";
import CustomButton from "@/app/(dashboards)/components/custom-components/CustomButton";
import PageTopBar from "@/app/(dashboards)/components/custom-components/PageTopBar";

export default async function UpcomingAppointments(props: {
  searchParams?: Promise<{
    query?: string;
  }>;
}) {
  const searchParams = await props.searchParams;
  const query = searchParams?.query || "";

  return (
    <div className="min-h-full flex flex-col gap-5 mb-10">
      <PageTopBar
        pageHeading="Appointments"
        showSearch={true}
        showFilters={true}
        extraBtns={
          <CustomButton
            text="Request an appointment"
            href="/patient/appointments/requests/new"
          />
        }
      />
      <Suspense key={query} fallback={<AppointmentGridSkeleton />}>
        <AppointmentGridWrapper query={query} />
      </Suspense>
    </div>
  );
}
