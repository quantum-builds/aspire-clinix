import SearchBar from "@/app/(dashboards)/components/SearchBar";
import { Suspense } from "react";
import DateFilter from "@/app/(dashboards)/components/DateFilter";
import AppointmentGridWrapper from "./components/AppointmentGridWrapper";
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
  // const searchParams = await props.searchParams;
  // const query = searchParams?.query || "";

  // const filteredAppointments = APPOINTMENTS.filter(
  //   (appointment) =>
  //     appointment.patientName.toLowerCase().includes(query.toLowerCase()) ||
  //     appointment.appointmentNumber.toLowerCase().includes(query)
  // );

  // if (filteredAppointments.length === 0) {
  //   return (
  //     <NoContent
  //       title="Appointments"
  //       placeholder="Enter Patient Name or Appointment Number"
  //     />
  //   );
  // }

  const searchParams = await props.searchParams;
  const query = searchParams?.query || "";
  const status = searchParams?.status || "";
  const on = searchParams?.on || "";
  const before = searchParams?.before || "";
  const after = searchParams?.after || "";
  const page = Number(searchParams?.page) || 1;

  return (
    <div>
      <div className=" w-full h-full flex flex-col gap-7">
        <div className="flex items-center justify-between">
          <h1 className="font-medium text-3xl">Appointments</h1>
          <div className="flex gap-2">
            <SearchBar placeholder="Enter Patient Name or Appointment Number" />
            <DateFilter
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
          </div>
        </div>
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
