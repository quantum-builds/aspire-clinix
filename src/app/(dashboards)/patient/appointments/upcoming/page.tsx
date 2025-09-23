import { TUpcomingAppointmentPatient } from "@/types/common";
import AppointmentGrid from "./component/AppointmentGrid";
import { Suspense } from "react";
import NoContent from "@/app/(dashboards)/components/NoContent";
import SearchBar from "@/app/(dashboards)/components/SearchBar";
import Button from "@/app/(dashboards)/components/Button";

const APPOINTMENT: TUpcomingAppointmentPatient[] = [
  {
    date: "July 07, 2025",
    time: "10:00 AM",
    appointmentNumber: "1621-115001",
    dentistId: "D001",
    dentistName: "Dr. Alice Johnson",
    disease: "Tooth Decay",
    gdcNumber: "192 168 101",
    dentistPhone: "+971 1111 1001",
    dentistEmail: "alice.johnson@gmail.com",
    practiceAddress: "Clinic 101, Street 400, Oslo, Norway",
    specialization: "Orthodontist",
  },
  {
    date: "July 07, 2025",
    time: "11:30 AM",
    appointmentNumber: "1621-115002",
    dentistId: "D002",
    dentistName: "Dr. Brian Lee",
    disease: "Tooth Decay",
    gdcNumber: "192 168 102",
    dentistPhone: "+971 1111 1002",
    dentistEmail: "brian.lee@gmail.com",
    practiceAddress: "Clinic 102, Street 401, Oslo, Norway",
    specialization: "Endodontist",
  },
  {
    date: "July 07, 2025",
    time: "12:30 PM",
    appointmentNumber: "1621-115003",
    dentistId: "D003",
    dentistName: "Dr. Clara Smith",
    gdcNumber: "192 168 103",
    disease: "Tooth Decay",
    dentistPhone: "+971 1111 1003",
    dentistEmail: "clara.smith@gmail.com",
    practiceAddress: "Clinic 103, Street 402, Oslo, Norway",
    specialization: "Periodontist",
  },
  {
    date: "July 07, 2025",
    time: "02:00 PM",
    appointmentNumber: "1621-115004",
    dentistId: "D004",
    dentistName: "Dr. Daniel Brown",
    gdcNumber: "192 168 104",
    disease: "Tooth Decay",
    dentistPhone: "+971 1111 1004",
    dentistEmail: "daniel.brown@gmail.com",
    practiceAddress: "Clinic 104, Street 403, Oslo, Norway",
    specialization: "Prosthodontist",
  },
  {
    date: "July 07, 2025",
    time: "03:15 PM",
    appointmentNumber: "1621-115005",
    dentistId: "D005",
    dentistName: "Dr. Emily Davis",
    gdcNumber: "192 168 105",
    disease: "Tooth Decay",
    dentistPhone: "+971 1111 1005",
    dentistEmail: "emily.davis@gmail.com",
    practiceAddress: "Clinic 105, Street 404, Oslo, Norway",
    specialization: "Pediatric Dentist",
  },
  {
    date: "July 07, 2025",
    time: "04:45 PM",
    appointmentNumber: "1621-115006",
    dentistId: "D006",
    dentistName: "Dr. Frank Wilson",
    gdcNumber: "192 168 106",
    disease: "Tooth Decay",
    dentistPhone: "+971 1111 1006",
    dentistEmail: "frank.wilson@gmail.com",
    practiceAddress: "Clinic 106, Street 405, Oslo, Norway",
    specialization: "Oral Surgeon",
  },
  {
    date: "July 08, 2025",
    time: "09:30 AM",
    appointmentNumber: "1621-115007",
    dentistId: "D007",
    dentistName: "Dr. Grace Martinez",
    gdcNumber: "192 168 107",
    disease: "Tooth Decay",
    dentistPhone: "+971 1111 1007",
    dentistEmail: "grace.martinez@gmail.com",
    practiceAddress: "Clinic 107, Street 406, Oslo, Norway",
    specialization: "General Dentist",
  },
  {
    date: "July 08, 2025",
    time: "11:00 AM",
    appointmentNumber: "1621-115008",
    dentistId: "D008",
    dentistName: "Dr. Henry Clark",
    gdcNumber: "192 168 108",
    disease: "Tooth Decay",
    dentistPhone: "+971 1111 1008",
    dentistEmail: "henry.clark@gmail.com",
    practiceAddress: "Clinic 108, Street 407, Oslo, Norway",
    specialization: "Cosmetic Dentist",
  },
];

export default async function UpcomingAppointments(props: {
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
        <div className="flex justify-end">
          <Button text="Book an Appointment" href="/patient/appointments/new" />
        </div>
        <Suspense key={query} fallback={<div>Loading.....</div>}>
          <AppointmentGrid appointments={filteredAppointments} />
        </Suspense>
      </div>
    </div>
  );
}
