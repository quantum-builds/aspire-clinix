import { Suspense } from "react";
import { AppointmentRequestStatus } from "@prisma/client";
import PageTopBar from "@/app/(dashboards)/components/custom-components/PageTopBar";
import { RequestDataTableSkeleton } from "./components/skeleton/RequestDataTableSkeleton";
import RequestDataTableWrapper from "./components/RequestDataTableWrapper";

export default async function RequestAppointments(props: {
  searchParams?: Promise<{
    query?: string;
    page?: string;
    status?: string;
    ts?: string;
  }>;
}) {
  const searchParams = await props.searchParams;
  const query = searchParams?.query || "";
  const status = searchParams?.status || "";
  const ts = new Date(searchParams?.ts || "");
  const page = Number(searchParams?.page) || 1;

  return (
    <div>
      <div className="min-h-screen flex flex-col gap-5">
        <PageTopBar
          pageHeading="Appointments Requests"
          showSearch={true}
          showFilters={true}
          statusOptions={[
            {
              value: AppointmentRequestStatus.APPROVED,
            },
            {
              value: AppointmentRequestStatus.PENDING,
            },
            {
              value: AppointmentRequestStatus.CANCEL,
            },
          ]}
        />

        <Suspense
          key={query + page + status + ts}
          fallback={<RequestDataTableSkeleton />}
        >
          <RequestDataTableWrapper query={query} page={page} status={status} />
        </Suspense>
      </div>
    </div>
  );
}
