import NoContent from "@/app/(dashboards)/components/NoContent";
import SearchBar from "@/app/(dashboards)/components/SearchBar";
import { TAppointmentDentist } from "@/types/common";
import { Suspense } from "react";
import AppointmentGrid from "./components/AppointmentGrid";
import DateFilter from "@/app/(dashboards)/components/DateFilter";

const APPOINTMENTS: TAppointmentDentist[] = [
  {
    date: "2025-09-16",
    time: "09:00",
    appointmentNumber: "APT001",
    disease: "Toothache",
    patientId: "P001",
    patientName: "Ali Khan",
    patientGender: "Male",
    patientAge: "28",
    patientPhone: "03001234567",
  },
  {
    date: "2025-09-16",
    time: "09:30",
    appointmentNumber: "APT002",
    disease: "Cavity",
    patientId: "P002",
    patientName: "Sara Ahmed",
    patientGender: "Female",
    patientAge: "34",
    patientPhone: "03012345678",
  },
  {
    date: "2025-09-16",
    time: "10:00",
    appointmentNumber: "APT003",
    disease: "Gum Bleeding",
    patientId: "P003",
    patientName: "Usman Ali",
    patientGender: "Male",
    patientAge: "42",
    patientPhone: "03023456789",
  },
  {
    date: "2025-09-16",
    time: "10:30",
    appointmentNumber: "APT004",
    disease: "Wisdom Tooth Extraction",
    patientId: "P004",
    patientName: "Fatima Noor",
    patientGender: "Female",
    patientAge: "25",
    patientPhone: "03034567890",
  },
  {
    date: "2025-09-16",
    time: "11:00",
    appointmentNumber: "APT005",
    disease: "Braces Adjustment",
    patientId: "P005",
    patientName: "Hassan Raza",
    patientGender: "Male",
    patientAge: "19",
    patientPhone: "03045678901",
  },
  {
    date: "2025-09-16",
    time: "11:30",
    appointmentNumber: "APT006",
    disease: "Root Canal",
    patientId: "P006",
    patientName: "Ayesha Siddiqui",
    patientGender: "Female",
    patientAge: "30",
    patientPhone: "03056789012",
  },
  {
    date: "2025-09-16",
    time: "12:00",
    appointmentNumber: "APT007",
    disease: "Tooth Filling",
    patientId: "P007",
    patientName: "Bilal Hussain",
    patientGender: "Male",
    patientAge: "36",
    patientPhone: "03067890123",
  },
  {
    date: "2025-09-16",
    time: "12:30",
    appointmentNumber: "APT008",
    disease: "Dental Cleaning",
    patientId: "P008",
    patientName: "Maryam Iqbal",
    patientGender: "Female",
    patientAge: "27",
    patientPhone: "03078901234",
  },
  {
    date: "2025-09-16",
    time: "13:00",
    appointmentNumber: "APT009",
    disease: "Broken Tooth",
    patientId: "P009",
    patientName: "Ahmed Faraz",
    patientGender: "Male",
    patientAge: "40",
    patientPhone: "03089012345",
  },
];

export default async function PastAppointments(props: {
  searchParams?: Promise<{
    query?: string;
  }>;
}) {
  const searchParams = await props.searchParams;
  const query = searchParams?.query || "";

  const filteredAppointments = APPOINTMENTS.filter(
    (appointment) =>
      appointment.patientName.toLowerCase().includes(query.toLowerCase()) ||
      appointment.appointmentNumber.toLowerCase().includes(query)
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
        <Suspense key={query} fallback={<div>Loading.....</div>}>
          <AppointmentGrid appointments={filteredAppointments} />
        </Suspense>
      </div>
    </div>
  );
}
