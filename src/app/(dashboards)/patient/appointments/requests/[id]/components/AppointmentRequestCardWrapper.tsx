import NoContent1 from "@/app/(dashboards)/components/NoContent1";
import { getAppointmentRequest } from "@/services/appointmentRequests/appointmentRequestQuery";
import { TAppointmentRequest } from "@/types/appointment-request";
import { Response } from "@/types/common";
import AppointmentRequestCard from "./AppointmentRequestCard";

interface AppointmentRequestCardWrapperProps {
  id: string;
}
export default async function AppointmentRequestCardWrapper({
  id,
}: AppointmentRequestCardWrapperProps) {
  const response: Response<TAppointmentRequest> = await getAppointmentRequest(
    id
  );

  if (!response.status || !response.data) {
    // return <NoContent title="Reports" placeholder="Enter Report title" />;
    return <NoContent1 />;
  }

  return <AppointmentRequestCard appointmentRequest={response.data} />;
}
