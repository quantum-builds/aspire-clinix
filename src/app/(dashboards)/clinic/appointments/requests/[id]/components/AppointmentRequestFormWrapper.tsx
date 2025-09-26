import { getAppointmentRequest } from "@/services/appointmentRequests/appointmentRequestQuery";
import { TAppointmentRequest } from "@/types/appointment-request";
import { Response } from "@/types/common";
import PatientDetails from "./PatientDetails";
import BookAppointmentForm from "./BookAppointmentForm";

interface AppointmentRequestFormWrapperProps {
  id: string;
}

export default async function AppointmentRequestFormWrapper({
  id,
}: AppointmentRequestFormWrapperProps) {
  const response: Response<TAppointmentRequest> = await getAppointmentRequest(
    id
  );
  return (
    <>
      <PatientDetails appointmentRequest={response.data} />
      <BookAppointmentForm />
    </>
  );
}
