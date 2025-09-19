import { Suspense } from "react";
import AppointmentGridWrapper from "./component/AppointmentGrid";

export default async function UpcomingAppointments(props: {
  searchParams?: Promise<{
    query?: string;
  }>;
}) {
  const searchParams = await props.searchParams;
  const query = searchParams?.query || "";

  return (
    <div className=" w-full h-full flex flex-col gap-7">
      <Suspense key={query} fallback={<div>Loading.....</div>}>
        <AppointmentGridWrapper query={query} />
      </Suspense>
    </div>
  );
}
