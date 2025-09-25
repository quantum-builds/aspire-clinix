import NoContent from "@/app/(dashboards)/components/NoContent";
import SearchBar from "@/app/(dashboards)/components/SearchBar";
import DateFilter from "@/app/(dashboards)/components/DateFilter";
import { AppointmentRequest } from "@/types/common";
import AppointmentRequestCard from "./components/AppointmentRequestCard";

const APPOINTMENTS: AppointmentRequest[] = [
  {
    id: "1",
    date: "July 07, 2025",
    time: "12:30 PM",
    patientName: "Maryam Iqbal",
    patientEmail: "harrykane@gmail.com",
    patientPhone: "+971 1121 2234",
    disease: "Dental Cleaning",
    appointmentDate: "July 26, 2025",
    appointmentReason: "I have a gum-bleeding problem",
    additionalNote:
      "I've noticed my gums bleed often, especially during brushing and flossing. It's been happening frequently and concerns me.",
  },
  {
    id: "2",
    date: "July 07, 2025",
    time: "12:30 PM",
    patientName: "Maryam Iqbal",
    patientEmail: "harrykane@gmail.com",
    patientPhone: "+971 1121 2234",
    disease: "Dental Cleaning",
    appointmentDate: "July 26, 2025",
    appointmentReason: "I have a gum-bleeding problem",
    additionalNote:
      "I've noticed my gums bleed often, especially during brushing and flossing. It's been happening frequently and concerns me.",
  },
];

export default async function RequestAppointments(props: {
  searchParams?: Promise<{
    query?: string;
  }>;
}) {
  const searchParams = await props.searchParams;
  const query = searchParams?.query || "";

  const filteredAppointments = APPOINTMENTS.filter((appointment) =>
    appointment.patientName.toLowerCase().includes(query.toLowerCase())
  );

  if (filteredAppointments.length === 0) {
    return (
      <NoContent
        title="Appointments"
        placeholder="Enter Patient Name or Appointment Number"
      />
    );
  }
  return (
    <div>
      <div className=" w-full h-full flex flex-col gap-7">
        <div className="flex items-center justify-between">
          <h1 className="font-medium text-3xl">Appointments</h1>
          <div className="flex gap-2">
            <SearchBar placeholder="Enter Patient Name or Appointment Number" />
            <DateFilter />
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl space-y-10">
          <div className="text-2xl font-medium">Appointment Requests</div>
          <div className="grid 1xl50:grid-cols-2 gap-6">
            {filteredAppointments.map((appointment) => (
              <AppointmentRequestCard
                key={appointment.id}
                appointment={appointment}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
