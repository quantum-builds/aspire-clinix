import PatientReferralDetails from "./PatientReferralDetials";
import { getReferralRequest } from "@/services/referralRequest/referralRequestQuery";
import { TReferralRequest } from "@/types/referral-request";
import { Response } from "@/types/common";
import PageTopBar from "@/app/(dashboards)/components/custom-components/PageTopBar";
import NoContent1 from "@/app/(dashboards)/components/NoContent1";
import { calculateAge } from "@/utils/formatDateTime";
import AppointmentCard from "./AppointmentCard";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { toTitleCase } from "@/utils/formatWords";

interface ReferralRequestDetailProps {
  id: string
  showModel: boolean
}

export default async function ReferralRequestDetail({ id, showModel }: ReferralRequestDetailProps) {
  const referralRequestResponse: Response<TReferralRequest> = await getReferralRequest(id)
  const session = await getServerSession(authOptions);
  const role = session?.user.role;

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
  const appointment = referralRequestResponse.data.appointment

  const patientDetails = {
    name: referralForm.patientName,
    phone: referralForm.patientPhoneNumber,
    email: referralForm.patientEmail,
    address: referralForm.patientAddress,
    age: String(calculateAge(referralForm.patientDateOfBirth))
  }

  const dentistDetails = {
    name: referralForm.referralName,
    phone: referralForm.referralPhoneNumber,
    email: referralForm.referralEmail,
    gdcNo: referralForm.referralGDC,
    address: referralForm.patientAddress
  }

  const referralFormDetails = {
    referralDeatils: referralForm.other ? referralForm.referralDetails.map((disease) => toTitleCase(disease)).join(", ") + ", " + referralForm.other : referralForm.referralDetails.map((disease) => toTitleCase(disease)).join(", "),
    treatmentDetails: referralForm.treatmentDetails,
    attendTreatment: referralForm.attendTreatment === "yes" ? "yes" : "no",
    medicalHistoryPDF: referralForm.medicalHistoryPdf
  }


  return (
    <div className="w-full min-h-screen flex flex-col gap-5">
      <PageTopBar
        showFilters={true}
        showSearch={true}
        showBackBtn={true}
        statusOptions={[]}
        pageHeading="Referral Requests"
      />
      <PatientReferralDetails
        id={id}
        showModel={showModel}
        patientDetials={patientDetails}
        dentistDetails={dentistDetails}
        referralFormDetails={referralFormDetails}

      />

      {
        appointment &&
        <AppointmentCard appointment={appointment} role={role ?? ""} />
      }
    </div>
  )
}