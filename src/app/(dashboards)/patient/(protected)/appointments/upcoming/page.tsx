import { getStripeStatus } from "@/services/stripe/stripe";
import UpcomingAppointmentsContent from "./component/UpcomingAppointmentsContent";
import AppointmentGridWrapper from "./component/AppointmentGrid";

export default async function UpcomingAppointments(props: {
  searchParams?: Promise<{
    status?: string;
    on?: string;
    before?: string;
    after?: string;
    session_id?: string;
  }>;
}) {
  const searchParams = await props.searchParams;
  const sessionId = searchParams?.session_id;

  console.log("UpcomingAppointments searchParams:", searchParams);
  console.log("UpcomingAppointments sessionId:", sessionId);

  let statusResponse = null;
  if (sessionId && sessionId.trim() !== "") {
    statusResponse = await getStripeStatus(sessionId);
  }

  const status = searchParams?.status || "";
  const on = searchParams?.on || "";
  const before = searchParams?.before || "";

  const today = new Date();
  const todayFormatted = today.toISOString().split("T")[0];
  const after = searchParams?.after || todayFormatted;

  return (
    <UpcomingAppointmentsContent
      status={statusResponse}
      searchParams={searchParams}
    >
      <AppointmentGridWrapper status={status} on={on} before={before} after={after} />
    </UpcomingAppointmentsContent>
  );
}
