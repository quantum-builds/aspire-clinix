import { Suspense } from "react";
import AppointmentGridWrapper from "./components/AppointmentGridWrapper";
import AppointmentGridSkeleton from "../components/skeletons/AppointmentGrid";
import PageTopBar from "@/app/(dashboards)/components/custom-components/PageTopBar";
import { AppointmentStatus } from "@prisma/client";

export default async function UpcomingAppointments(props: {
  searchParams?: Promise<{
    query?: string;
    page?: string;
    status?: string;
    on?: string;
    before?: string;
    after?: string;
  }>;
}) {
  const searchParams = await props.searchParams;
  const query = searchParams?.query || "";
  const status = searchParams?.status || AppointmentStatus.PENDING;
  const on = searchParams?.on || "";
  const before = searchParams?.before || "";
  const after = searchParams?.after || "";
  const page = Number(searchParams?.page) || 1;

  return (
    <div>
      <div className="min-h-screen flex flex-col gap-5">
        <PageTopBar
          pageHeading="Appointments"
          showSearch={true}
          showFilters={true}
          statusOptions={[
            {
              value: AppointmentStatus.CANCELLED,
            },
            {
              value: AppointmentStatus.PENDING,
            },
          ]}
        />
        <Suspense
          key={query + page + status + on + before + after}
          fallback={<AppointmentGridSkeleton />}
        >
          <AppointmentGridWrapper
            query={query}
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
