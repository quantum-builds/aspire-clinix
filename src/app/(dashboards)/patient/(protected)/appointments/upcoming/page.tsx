import { Suspense } from "react";

import AppointmentGridWrapper from "./component/AppointmentGrid";
import { AppointmentGridSkeleton } from "./component/skeletons/AppointmentGridSkeelton";
import PageTopBar from "@/app/(dashboards)/components/custom-components/PageTopBar";
import { AppointmentStatus } from "@prisma/client";
import CustomButton from "@/app/(dashboards)/components/custom-components/CustomButton";
import { AppointmentState } from "@/types/appointment";

export default async function UpcomingAppointments(props: {
  searchParams?: Promise<{
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

  // Default after date to today (YYYY-MM-DD format) for upcoming appointments
  const today = new Date();
  const todayFormatted = today.toISOString().split('T')[0];
  const after = searchParams?.after || todayFormatted;

  return (
    <div className="min-h-[103vh] flex flex-col gap-5">
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
        extraBtns={
          <CustomButton
            text="Pre-book consultation"
            href="https://aspire-dental.portal.dental/"
          />
        }
      />
      <Suspense
        key={status + on + before + after}
        fallback={<AppointmentGridSkeleton />}
      >
        <AppointmentGridWrapper
          status={status}
          on={on}
          before={before}
          after={after}
        />
      </Suspense>
    </div>
  );
}
