import AppointmentForm from "./components/CreateAppointmentForm";
import PageTopBar from "@/app/(dashboards)/components/custom-components/PageTopBar";

export default async function BookAppointmentPage() {
  return (
    <div className="w-full min-h-[103vh] flex flex-col gap-5">
      <PageTopBar
        pageHeading="Appointment Request"
        showFilters={false}
        showSearch={false}
        showBackBtn={true}
        statusOptions={[]}
      />
      <AppointmentForm />
    </div>
  );
}
