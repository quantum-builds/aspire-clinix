import SearchBar from "@/app/(dashboards)/components/SearchBar";
import DateFilter from "@/app/(dashboards)/components/DateFilter";
import AppointmentRequestGrid from "./components/AppointmentRequestGrid";
import { Suspense } from "react";

export default async function RequestAppointments(props: {
  searchParams?: Promise<{
    query?: string;
    page?: string;
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
  const page = Number(searchParams?.page) || 1;

  return (
    <div>
      <div className=" w-full h-full flex flex-col gap-7">
        <div className="flex items-center justify-between">
          <h1 className="font-medium text-3xl">Appontment Requests</h1>
          <div className="flex gap-2">
            <SearchBar placeholder="Enter Appointment Number" />
            <DateFilter />
          </div>
        </div>
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
        <Suspense key={page + query} fallback={<div>loading...</div>}>
          <AppointmentRequestGrid query={query} page={page} />
        </Suspense>
      </div>
    </div>
  );
}
