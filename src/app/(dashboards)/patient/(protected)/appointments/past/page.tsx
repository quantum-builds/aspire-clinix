import { Suspense } from "react";
import AppointmentGridWrapper from "./component/AppointmentGrid";
import { AppointmentGridSkeleton } from "./component/skeletons/AppointmentGrid";
import PageTopBar from "@/app/(dashboards)/components/custom-components/PageTopBar";
import CustomButton from "@/app/(dashboards)/components/custom-components/CustomButton";
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

  // Default before date to today (YYYY-MM-DD format) for past appointments
  const today = new Date();
  const todayFormatted = today.toISOString().split('T')[0];
  const before = searchParams?.before || todayFormatted;

  const after = searchParams?.after || "";
  const page = Number(searchParams?.page) || 1;

  return (
    <div className="min-h-[103vh] flex flex-col gap-5">
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
        extraBtns={
          <CustomButton
            text="Pre-book consultation"
            href="https://aspire-dental.portal.dental/"
          />
        }
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
        />
      </Suspense>
    </div>
  );
}
