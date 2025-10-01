import { Suspense } from "react";
import AppointmentGridWrapper from "./component/AppointmentGrid";
import { AppointmentGridSkeleton } from "./component/skeletons/AppointmentGrid";
import PageTopBar from "@/app/(dashboards)/components/custom-components/PageTopBar";
import { AppointmentStatus } from "@prisma/client";
import CustomButton from "@/app/(dashboards)/components/custom-components/CustomButton";

export default async function PastAppointments(props: {
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
    <div className="min-h-[103vh] flex flex-col gap-5">
      <PageTopBar
        pageHeading="Appointments"
        showSearch={true}
        showFilters={true}
        statusOptions={[
          {
            value: AppointmentStatus.COMPLETED,
          },
          {
            value: AppointmentStatus.CANCELLED,
          },
          {
            value: AppointmentStatus.DID_NOT_ATTEND,
          },
          {
            value: AppointmentStatus.ARRIVED,
          },
          {
            value: AppointmentStatus.IN_SURGERY,
          },
        ]}
        extraBtns={
          <CustomButton
            text="Request an appointment"
            href="/patient/appointments/requests/new"
          />
        }
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
  );
}
