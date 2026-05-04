import { Suspense } from "react";
import AppointmentGridWrapper from "./components/AppointmentGridWrapper";
import AppointmentGridSkeleton from "../components/skeletons/AppointmentGrid";
import PageTopBar from "@/app/(dashboards)/components/custom-components/PageTopBar";
import { AppointmentStatus } from "@prisma/client";
import { AppointmentState } from "@/types/appointment";

export default async function UpcomingAppointments(props: {
  searchParams?: Promise<{
    page?: string;
    status?: string;
    on?: string;
    before?: string;
    after?: string;
  }>;
}) {
  const searchParams = await props.searchParams;
  const status = searchParams?.status || "";
  const on = searchParams?.on || "";
  const before = searchParams?.before || "";
  const page = Number(searchParams?.page) || 1;

  // Default after date to today (YYYY-MM-DD format) for upcoming appointments
  const today = new Date();
  const todayFormatted = today.toISOString().split('T')[0];
  const after = searchParams?.after || todayFormatted;

  return (
    <div className="min-h-screen flex flex-col gap-5">
      <PageTopBar
        pageHeading="Appointments"
        showSearch={false}
        showFilters={true}
        lockAfterDate={true}
        statusOptions={[
          {
            value: AppointmentState.PENDING,
          },
          {
            value: AppointmentState.CONFIRMED,
          },
          {
            value: AppointmentState.ARRIVED,
          },
          {
            value: AppointmentState.INSURGERY,
          },
          {
            value: AppointmentState.COMPLETED,
          },
          {
            value: AppointmentState.CANCELLED,
          },
          {
            value: AppointmentState.DIDNOTATTEND,
          }
        ]}
      />
      <Suspense
        key={page + status + on + before + after}
        fallback={<AppointmentGridSkeleton />}
      >
        <AppointmentGridWrapper
          page={page}
          status={status}
          on={on}
          before={before}
          after={after}
        />{" "}
      </Suspense>
    </div>
  );
}
