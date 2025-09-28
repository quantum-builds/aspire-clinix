import { Suspense } from "react";
import AppointmentGridWrapper from "./components/AppointmentGridWrapper";
import PageTopBar from "@/app/(dashboards)/components/custom-components/PageTopBar";
import { AppointmentStatus } from "@prisma/client";
import AppointmentGridSkeleton from "../components/skeletons/AppointmentGrid";

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
  const status = searchParams?.status || "";
  const on = searchParams?.on || "";
  const before = searchParams?.before || "";
  const after = searchParams?.after || "";
  const page = Number(searchParams?.page) || 1;

  return (
    <div className="min-h-full flex flex-col gap-5 mb-10">
      <PageTopBar
        pageHeading="Appointments"
        showSearch={true}
        showFilters={true}
        statusOptions={[
          {
            value: AppointmentStatus.CONFIRMED,
          },
          {
            value: AppointmentStatus.PENDING,
          },
          {
            value: AppointmentStatus.CANCELLED,
          },
        ]}
      />
      <Suspense
        key={query + page + status + on + before + after}
        fallback={<AppointmentGridSkeleton type="UPCOMING" />}
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
  );
}
