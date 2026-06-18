import UnAssignedPatientDetails from "../components/UnAssignedPatientDetails";
import Button from "@/app/(dashboards)/components/Button";
import PageTopBar from "@/app/(dashboards)/components/custom-components/PageTopBar";
import { TReferralRequest } from "@/types/referral-request";
import { getReferralRequest } from "@/services/referralRequest/referralRequestQuery";
import { Response } from "@/types/common";
import NoContent1 from "@/app/(dashboards)/components/NoContent1";
import { calculateAge } from "@/utils/formatDateTime";
import { toTitleCase } from "@/utils/formatWords";

interface UnAssignedWrapperProps {
  id: string;
  showModel: boolean;
}
export default async function UnAssignedWrapper({
  id,
  showModel,
}: UnAssignedWrapperProps) {
  const referralRequestResponse: Response<TReferralRequest> =
    await getReferralRequest(id);

  if (
    !referralRequestResponse ||
    !referralRequestResponse.status ||
    !referralRequestResponse.data ||
    !referralRequestResponse.data.referralForm
  ) {
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
    );
  }

  const referralForm = referralRequestResponse.data.referralForm;
  const referralRequest = referralRequestResponse.data;


  const patientDetails = {
    name: referralForm.patientName,
    phone: referralForm.patientPhoneNumber,
    email: referralForm.patientEmail,
    address: referralForm.patientAddress,
    age: String(calculateAge(referralForm.patientDateOfBirth)),
  };

  const dentistDetails = {
    name: referralForm.referralName,
    phone: referralForm.referralPhoneNumber,
    email: referralForm.referralEmail,
    gdcNo: referralForm.referralGDC,
    address: referralForm.patientAddress,
  };

  // Build referral details based on which field is populated (cbct or dentalSpecialty)
  const referralType = referralForm.cbct
    ? referralForm.cbct
    : referralForm.dentalSpecialty
      ? toTitleCase(referralForm.dentalSpecialty)
      : "Not specified";
  const referralDetails = referralForm.other
    ? `${referralType}, ${referralForm.other}`
    : referralType;

  const referralFormDetails = {
    referralDeatils: referralDetails,
    treatmentDetails: referralForm.treatmentDetails,
    attendTreatment: referralForm.attendTreatment === "yes" ? "yes" : "no",
    medicalHistoryPDF:
      referralForm.medicalHistoryPdf ?? referralForm.medicalHistoryPdfUrl,
    cbctReportPdfUrl: referralForm.cbctReportPdfUrl ?? null,
    prescriptionDetails: referralForm.prescriptionDetails,
  };

  return (
    <div className="min-h-screen flex flex-col gap-5">
      <PageTopBar
        pageHeading="Referrals Details"
        showSearch={false}
        showBackBtn={true}
        showFilters={false}
        statusOptions={null}
      />
      <UnAssignedPatientDetails
        id={id}
        showModel={showModel}
        referralFormDetails={referralFormDetails}
        patientDetials={patientDetails}
        referralDentistDetails={dentistDetails}
        referralRequestId={referralRequest.id}
      />
    </div>
  );
}
