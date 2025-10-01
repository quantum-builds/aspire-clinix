import { getAppointmentRequest } from "@/services/appointmentRequests/appointmentRequestQuery";
import { TAppointmentRequest } from "@/types/appointment-request";
import { Response } from "@/types/common";
import BookAppointmentForm from "./BookAppointmentForm";
import { TDentist } from "@/types/dentist";
import { TPractice } from "@/types/practice";
import { getDentistPractice } from "@/services/dentistOnPractice/dentistOnPracticeQuery";
import { TDentistPractice } from "@/types/dentistRequest";
import NoContent1 from "@/app/(dashboards)/components/NoContent1";

interface AppointmentRequestFormWrapperProps {
  id: string;
  practiceId: string;
  practices: TPractice[];
}

export default async function AppointmentRequestFormWrapper({
  id,
  practiceId,
  practices,
}: AppointmentRequestFormWrapperProps) {
  const response: Response<TAppointmentRequest> = await getAppointmentRequest(
    id
  );

  let dentists: TDentist[] = [];
  console.log("practice is ", practiceId);
  if (practiceId.trim().length > 0) {
    console.log("in the if ");
    const response: Response<TDentistPractice[]> = await getDentistPractice({
      practiceId: practiceId,
    });

    dentists = response.data?.map((dp) => dp.dentist) ?? [];
  }

  if (!response || !response.data || !response.data.patient) {
    return <NoContent1 />;
  }
  return (
    <>
      <BookAppointmentForm
        practices={practices}
        dentists={dentists}
        appointmentRequest={response.data}
      />
    </>
  );
}
