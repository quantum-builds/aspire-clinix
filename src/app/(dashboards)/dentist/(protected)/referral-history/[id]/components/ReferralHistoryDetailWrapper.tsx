
import PatientReferralDetails from "./PatientReferralDetials";
import Button from "@/app/(dashboards)/components/Button";
import { getReferralRequest } from "@/services/referralRequest/referralRequestQuery";
import { TReferralRequest } from "@/types/referral-request";
import { Response } from "@/types/common";
import PageTopBar from "@/app/(dashboards)/components/custom-components/PageTopBar";
import NoContent1 from "@/app/(dashboards)/components/NoContent1";
import { calculateAge } from "@/utils/formatDateTime";
import AssignedAppointmentCard from "@/app/(dashboards)/clinic/(protected)/referrals/[id]/assigned/components/AppointmentCard";
import { toTitleCase } from "@/utils/formatWords";

interface ReferralHistoryDetailProps {
    id: string
    showModel: boolean
}

export default async function ReferralHistoryDetail({ id, showModel }: ReferralHistoryDetailProps) {
    const referralRequestResponse: Response<TReferralRequest> = await getReferralRequest(id)
    console.log("show modal is ",showModel)
    if (!referralRequestResponse || !referralRequestResponse.status || !referralRequestResponse.data || !referralRequestResponse.data.referralForm) {
        return (
            <div className="min-h-screen flex flex-col gap-5">
                <PageTopBar
                    pageHeading="Referrals Details"
                    showSearch={false}
                    showBackBtn={true}
                    showFilters={false}
                    statusOptions={null}
                />
                <NoContent1 />
            </div>
        )
    }


    const referralForm = referralRequestResponse.data.referralForm
    const assignedDentist = referralRequestResponse.data.assignedDentist
    const appointment = referralRequestResponse.data.appointment

    const patientDetails = {
        name: referralForm.patientName,
        phone: referralForm.patientPhoneNumber,
        email: referralForm.patientEmail,
        address: referralForm.patientAddress,
        //  referralForm.referralDetails.map((detail)=>toTitleCase(detail)).join(", "),
        age: String(calculateAge(referralForm.patientDateOfBirth))
    }

    const assignedDentistDetails = {
        name: assignedDentist?.fullName,
        phone: assignedDentist?.phoneNumber,
        email: assignedDentist?.email,
        gdcNo: assignedDentist?.gdcNo,
        address: assignedDentist?.practiceAddress
    }
    const referralFormDetails = {
        referralDeatils: referralForm.other ? referralForm.referralDetails.map((disease) => toTitleCase(disease)).join(", ") + ", " + referralForm.other : referralForm.referralDetails.map((disease) => toTitleCase(disease)).join(", "),
        treatmentDetails: referralForm.treatmentDetails,
        attendTreatment: referralForm.attendTreatment === "yes" ? "yes" : "no",
        medicalHistoryPDF: referralForm.medicalHistoryPdf
    }

    return (
        <div className="min-h-screen flex flex-col gap-5">
            <PageTopBar
                pageHeading="Referrals Details"
                showSearch={false}
                showFilters={false}
                showBackBtn={true}
                statusOptions={[]}
                extraBtns={

                    <Button
                        text="View Referral form"
                        href={`/dentist/referral-history/${id}/edit`}
                    />
                }
            />
            <PatientReferralDetails
                id={id}
                showModel={showModel}
                referralFormDetails={referralFormDetails}
                patientDetials={patientDetails}
                assignedDentistDetails={assignedDentistDetails}
            />
            {appointment &&
                <AssignedAppointmentCard appointment={appointment} />
            }
        </div>
    )
}