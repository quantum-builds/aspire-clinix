import { Suspense } from "react";
import RequestDataTableWrapper from "./components/RequestDataTableWrapper";
import PageTopBar from "@/app/(dashboards)/components/custom-components/PageTopBar";
import { AppointmentRequestStatus, AppointmentStatus } from "@prisma/client";
import CustomButton from "@/app/(dashboards)/components/custom-components/CustomButton";
import { AppointmentGridSkeleton } from "../past/component/skeletons/AppointmentGrid";

export default async function ReferralHistory(props: {
  searchParams?: Promise<{
   query?: string;
    page?: string;
    status?: string;
    on?: string;
    before?: string;
    after?: string;
    ts?: string;
  }>;
}) {
 const searchParams = await props.searchParams;
  const query = searchParams?.query || "";
  const status = searchParams?.status || AppointmentStatus.PENDING;
  const on = searchParams?.on || "";
  const before = searchParams?.before || "";
  const after = searchParams?.after || (new Date()).toISOString();
  const page = Number(searchParams?.page) || 1;
  const ts = new Date(searchParams?.ts || "");
  

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
        key={query + page + status + ts + on + before + after}
        fallback={<AppointmentGridSkeleton />}
      >
        <RequestDataTableWrapper query={query} page={page} status={status} on={on} before={before} after={after} />
      </Suspense>
    </div>
  );
}
