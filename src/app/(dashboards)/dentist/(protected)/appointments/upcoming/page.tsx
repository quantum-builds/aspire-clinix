import { Suspense } from "react";
import AppointmentGridWrapper from "./components/AppointmentGridWrapper";
import AppointmentGridSkeleton from "../components/skeletons/AppointmentGrid";
import PageTopBar from "@/app/(dashboards)/components/custom-components/PageTopBar";

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
    <div>
      <div className="min-h-[103vh] flex flex-col gap-5">
        <PageTopBar
          pageHeading="Appointments"
          showSearch={true}
          showFilters={true}
          statusOptions={null}
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
          />{" "}
        </Suspense>
      </div>
    </div>
  );
}
