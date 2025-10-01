import { Suspense } from "react";
import RequestDataTableWrapper from "./components/RequestDataTableWrapper";
import PageTopBar from "@/app/(dashboards)/components/custom-components/PageTopBar";
import { RequestDataTableSkeleton } from "./components/skeleton/RequestDataTableSkeleton";
import { AppointmentRequestStatus } from "@prisma/client";
import CustomButton from "@/app/(dashboards)/components/custom-components/CustomButton";
import { AppointmentGridSkeleton } from "../past/component/skeletons/AppointmentGrid";

export default async function ReferralHistory(props: {
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
    <div className="min-h-[103vh] flex flex-col gap-5">
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
        fallback={<AppointmentGridSkeleton />}
      >
        <RequestDataTableWrapper query={query} page={page} status={status} />
      </Suspense>
    </div>
  );
}
