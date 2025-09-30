import BackButton from "@/app/(dashboards)/components/BackButton";
import AppointmentForm from "./components/CreateAppointmentForm";
import PageTopBar from "@/app/(dashboards)/components/custom-components/PageTopBar";

export default async function BookAppointmentPage() {
  return (
    <div className="w-full min-h-screen flex flex-col gap-5">
      <PageTopBar
        pageHeading="Appointment Request"
        showFilters={false}
        showSearch={false}
        extraBtns={<BackButton />}
        statusOptions={[]}
      />
      <AppointmentForm />
    </div>
  );
}
