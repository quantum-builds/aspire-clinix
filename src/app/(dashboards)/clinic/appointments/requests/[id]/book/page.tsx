import BackButton from "@/app/(dashboards)/components/BackButton";
import NoContent from "@/app/(dashboards)/components/NoContent";
import PatientDetails from "../components/PatientDetails";
import BookAppointmentForm from "../components/BookAppointmentForm";
import { AppointmentRequest } from "@/types/common";

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

type PageProps = {
  params: {
    id: string;
  };
};

export default async function ReferralDetailsPage({ params }: PageProps) {
  const appointmentId = params.id;

  const appointment = APPOINTMENTS.find(
    (appointment) => appointment.id === appointmentId
  );

  if (!appointment) {
    return <NoContent title="No Appointment Found" />;
  }

  return (
    <div className=" w-full h-full flex flex-col gap-7">
      <div className="flex items-center justify-between">
        <h1 className="font-medium text-3xl">Appointments</h1>
        <BackButton />
      </div>
      <PatientDetails appointment={appointment} />
      <BookAppointmentForm />
    </div>
  );
}
