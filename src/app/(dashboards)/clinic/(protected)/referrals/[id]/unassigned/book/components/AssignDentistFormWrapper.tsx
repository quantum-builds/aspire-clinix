
import { getReferralRequest } from "@/services/referralRequest/referralRequestQuery";
import { TReferralRequest } from "@/types/referral-request";
import AssignDentistForm from "./AssignDentistForm";
import { TDentist } from "@/types/dentist";
import { Response } from "@/types/common";
import { TDentistPractice } from "@/types/dentistRequest";
import { getDentistPractice } from "@/services/dentistOnPractice/dentistOnPracticeQuery";
import { PracticeApprovalStatus } from "@prisma/client";
import { TPatient } from "@/types/patient";
import { getPractices } from "@/services/practice/practiceQuery";
import { TPracticeResponse } from "@/types/practice";
import { getPatient } from "@/services/patient/patientQuery";

interface AppointmentRequestPageWrapperProps {
    id: string;
    practiceId: string;
}

export default async function AppointmentRequestPageWrapper({
    id,
    practiceId,
}: AppointmentRequestPageWrapperProps) {

    const practiceResponse: Response<TPracticeResponse> = await getPractices({})
    const practices = practiceResponse.data?.practices ?? [];
    const referralRequestResponse: Response<TReferralRequest> =
        await getReferralRequest(id);
    const referralRequest = referralRequestResponse?.data

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

    return (
        <AssignDentistForm practiceId={practiceId} practices={practices} dentists={dentists} patient={patientResponse?.data ?? null} referralRequest={referralRequest} />
    )

}
