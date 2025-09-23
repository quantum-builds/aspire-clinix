import BackButton from "@/app/(dashboards)/components/BackButton";
import { APPOINTMENTS } from "../../page";
import NoContent from "@/app/(dashboards)/components/NoContent";
import PatientDetails from "../components/PatientDetails";
import BookAppointmentForm from "../components/BookAppointmentForm";

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
