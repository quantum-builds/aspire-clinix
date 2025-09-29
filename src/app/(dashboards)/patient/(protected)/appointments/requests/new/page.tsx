import BackButton from "@/app/(dashboards)/components/BackButton";
import AppointmentForm from "./components/CreateAppointmentForm";

export default async function BookAppointmentPage() {
  return (
    <div className=" w-full h-full flex flex-col gap-7">
      <div className="flex items-center justify-between">
        <h1 className="font-medium text-3xl">Appointment Request</h1>
        <BackButton />
      </div>
      <AppointmentForm />
    </div>
  );
}
