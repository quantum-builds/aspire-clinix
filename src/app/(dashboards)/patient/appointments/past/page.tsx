import { Suspense } from "react";
import Pagination from "@/app/(dashboards)/components/Pagination";
import AppointmentGridWrapper from "./component/AppointmentGrid";

export default async function PastAppointments(props: {
  searchParams?: Promise<{
    query?: string;
    page?: string;
  }>;
}) {
  const searchParams = await props.searchParams;
  const query = searchParams?.query || "";
  const page = Number(searchParams?.page) || 1;

  return (
    <div className=" w-full h-full flex flex-col gap-7">
      <Suspense key={query + page} fallback={<div>Loading.....</div>}>
        <AppointmentGridWrapper query={query} page={page} />

        <Pagination page={page} />
      </Suspense>
    </div>
  );
}
