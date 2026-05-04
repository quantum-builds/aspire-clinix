import { Suspense } from "react";
import AppointmentGridWrapper from "./components/AppointmentGridWrapper";
import { AppointmentStatus } from "@prisma/client";
import AppointmentGridSkeleton from "../components/skeletons/AppointmentGrid";
import PageTopBar from "@/app/(dashboards)/components/custom-components/PageTopBar";
import { AppointmentState } from "@/types/appointment";

export default async function PastAppointments(props: {
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
  const after = searchParams?.after || "";
  const page = Number(searchParams?.page) || 1;

  // Default before date to today (YYYY-MM-DD format) for past appointments
  const today = new Date();
  const todayFormatted = today.toISOString().split('T')[0];
  const before = searchParams?.before || todayFormatted;

  return (
    <div>
      <div className="min-h-screen flex flex-col gap-5">
        <PageTopBar
          pageHeading="Appointments"
          showSearch={false}
          showFilters={true}
          lockBeforeDate={true}
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
          key={ page + status + on + before + after}
          fallback={<AppointmentGridSkeleton />}
        >
          <AppointmentGridWrapper
            page={page}
            status={status}
            on={on}
            before={before}
            after={after}
          />
        </Suspense>
      </div>
    </div>
  );
}
