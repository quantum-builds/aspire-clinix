
import { TPractice } from "@/types/practice";
import AssignDentistForm from "./AssignDentistForm";
import { TDentist } from "@/types/dentist";
import { Response } from "@/types/common";
import { TDentistPractice } from "@/types/dentistRequest";
import { getDentistPractice } from "@/services/dentistOnPractice/dentistOnPracticeQuery";
import { PracticeApprovalStatus } from "@prisma/client";
import { TReferralRequest } from "@/types/referral-request";
import { TPatient } from "@/types/patient";
import { getPatient } from "@/services/patient/patientQuery";

interface AppointmentRequestPageWrapperProps {
    id: string;
    practiceId: string;
    practices: TPractice[]
    referralRequest: TReferralRequest
}

export default async function AppointmentRequestPageWrapper({
    id,
    practiceId,
    practices,
    referralRequest
}: AppointmentRequestPageWrapperProps) {

    let dentists: TDentist[] = [];
    if (practiceId.trim().length > 0) {
        console.log("in the if ");
        const response: Response<TDentistPractice[]> = await getDentistPractice({
            practiceId: practiceId,
            status: PracticeApprovalStatus.APPROVED,
        });

        dentists = response.data?.map((dp) => dp.dentist) ?? [];
    }
    const patientResponse: Response<TPatient> = await getPatient(referralRequest.referralForm.patientEmail)
    console.log("pateint response is ",patientResponse)
    return (
        <AssignDentistForm practiceId={practiceId} practices={practices} dentists={dentists} patient={patientResponse?.data ?? null} referralRequest={referralRequest} />
    )

}
