import AppointmentRequestGrid from "./components/AppointmentRequestGrid";
import { Suspense } from "react";
import { AppointmentRequestStatus } from "@prisma/client";
import AppointmentRequestGridSkeleton from "./components/skeleton/AppointmentRequestGrid";
import PageTopBar from "@/app/(dashboards)/components/custom-components/PageTopBar";

export default async function RequestAppointments(props: {
  searchParams?: Promise<{
    query?: string;
    page?: string;
    status?: string;
    ts?: string;
  }>;
}) {
  // const searchParams = await props.searchParams;
  // const query = searchParams?.query || "";

  // const filteredAppointments = APPOINTMENTS.filter((appointment) =>
  //   appointment.patientName.toLowerCase().includes(query.toLowerCase())
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
  const ts = new Date(searchParams?.ts || "");
  const page = Number(searchParams?.page) || 1;

  return (
    <div>
      <div className="min-h-full flex flex-col gap-5 mb-10">
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
        {/* <div className="bg-white p-6 rounded-2xl space-y-10">
          <div className="text-2xl font-medium">Appointment Requests</div>
          <div className="grid 1xl50:grid-cols-2 gap-6">
            {filteredAppointments.map((appointment) => (
              <AppointmentRequestCard
                key={appointment.id}
                appointment={appointment}
              />
            ))}
          </div>
        </div> */}
        <Suspense
          key={page + query + status + ts}
          fallback={<AppointmentRequestGridSkeleton />}
        >
          <AppointmentRequestGrid query={query} page={page} status={status} />
        </Suspense>
      </div>
    </div>
  );
}
