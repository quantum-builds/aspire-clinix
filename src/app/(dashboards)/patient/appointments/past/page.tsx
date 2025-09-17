import { TPastAppointment } from "@/types/common";
import { Suspense } from "react";
import NoContent from "../../components/NoContent";
import AppointmentGrid from "./component/AppointmentGrid";
import SearchBar from "@/app/(dashboards)/components/SearchBar";

const APPOINTMENT: TPastAppointment[] = [
  {
    date: "July 07, 2025",
    time: "10:00 AM",
    appointmentNumber: "1621-115001",
    dentistId: "D001",
    dentistName: "Dr. Alice Johnson",
    gdcNumber: "192 168 101",
    dentistPhone: "+971 1111 1001",
    disease: "Tooth Decay",
  },
  {
    date: "July 07, 2025",
    time: "11:30 AM",
    appointmentNumber: "1621-115002",
    dentistId: "D002",
    dentistName: "Dr. Brian Lee",
    gdcNumber: "192 168 102",
    dentistPhone: "+971 1111 1002",
    disease: "Tooth Decay",
  },
  {
    date: "July 07, 2025",
    time: "12:30 PM",
    appointmentNumber: "1621-115003",
    dentistId: "D003",
    dentistName: "Dr. Clara Smith",
    gdcNumber: "192 168 103",
    dentistPhone: "+971 1111 1003",
    disease: "Tooth Decay",
  },
  {
    date: "July 07, 2025",
    time: "02:00 PM",
    appointmentNumber: "1621-115004",
    dentistId: "D004",
    dentistName: "Dr. Daniel Brown",
    gdcNumber: "192 168 104",
    dentistPhone: "+971 1111 1004",
    disease: "Tooth Decay",
  },
  {
    date: "July 07, 2025",
    time: "03:15 PM",
    appointmentNumber: "1621-115005",
    dentistId: "D005",
    dentistName: "Dr. Emily Davis",
    gdcNumber: "192 168 105",
    dentistPhone: "+971 1111 1005",
    disease: "Tooth Decay",
  },
  {
    date: "July 07, 2025",
    time: "04:45 PM",
    appointmentNumber: "1621-115006",
    dentistId: "D006",
    dentistName: "Dr. Frank Wilson",
    gdcNumber: "192 168 106",
    dentistPhone: "+971 1111 1006",
    disease: "Tooth Decay",
  },
  {
    date: "July 08, 2025",
    time: "09:30 AM",
    appointmentNumber: "1621-115007",
    dentistId: "D007",
    dentistName: "Dr. Grace Martinez",
    gdcNumber: "192 168 107",
    dentistPhone: "+971 1111 1007",
    disease: "Tooth Decay",
  },
  {
    date: "July 08, 2025",
    time: "11:00 AM",
    appointmentNumber: "1621-115008",
    dentistId: "D008",
    dentistName: "Dr. Henry Clark",
    gdcNumber: "192 168 108",
    dentistPhone: "+971 1111 1008",
    disease: "Tooth Decay",
  },
];

export default async function PastAppointments(props: {
  searchParams?: Promise<{
    query?: string;
  }>;
}) {
  const searchParams = await props.searchParams;
  const query = searchParams?.query || "";

  const filteredAppointments = APPOINTMENT.filter(
    (appointment) =>
      appointment.dentistName.toLowerCase().includes(query.toLowerCase()) ||
      appointment.appointmentNumber.toLowerCase().includes(query)
  );

  if (filteredAppointments.length === 0) {
    return (
      <NoContent
        title="Appointments"
        placeholder="Enter Dentist Name or Appointment Number"
      />
    );
  }
  return (
    <div>
      <div className=" w-full h-full flex flex-col gap-7">
        <div className="flex items-center justify-between">
          <h1 className="font-medium text-3xl">Appointments</h1>
          <div>
            <SearchBar placeholder="Enter Dentist Name or Appointment Number" />
          </div>
        </div>
        <Suspense key={query} fallback={<div>Loading.....</div>}>
          <AppointmentGrid appointments={filteredAppointments} />
        </Suspense>
      </div>
    </div>
  );
}
