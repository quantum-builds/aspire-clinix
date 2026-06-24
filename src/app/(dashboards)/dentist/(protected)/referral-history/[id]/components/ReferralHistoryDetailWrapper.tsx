import PatientReferralDetails from "./PatientReferralDetials";
import Button from "@/app/(dashboards)/components/Button";
import { getReferralRequest } from "@/services/referralRequest/referralRequestQuery";
import { TReferralRequest } from "@/types/referral-request";
import { Response } from "@/types/common";
import PageTopBar from "@/app/(dashboards)/components/custom-components/PageTopBar";
import NoContent1 from "@/app/(dashboards)/components/NoContent1";
import { calculateAge } from "@/utils/formatDateTime";
import { toTitleCase } from "@/utils/formatWords";
import AssignedAppointmentCard from "@/app/(dashboards)/clinic/(protected)/referrals/[id]/assigned/components/AppointmentCard";

interface ReferralHistoryDetailProps {
  id: string;
  showModel: boolean;
}

export default async function ReferralHistoryDetail({
  id,
  showModel,
}: ReferralHistoryDetailProps) {
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
  const assignedDentist = referralRequestResponse.data.assignedDentist;
  const appointment = referralRequestResponse.data.appointment;

  const patientDetails = {
    name: referralForm.patientName,
    phone: referralForm.patientPhoneNumber,
    email: referralForm.patientEmail,
    address: referralForm.patientAddress,
    //  referralForm.referralDetails.map((detail)=>toTitleCase(detail)).join(", "),
    age: String(calculateAge(referralForm.patientDateOfBirth)),
  };

  const assignedDentistDetails = {
    name: [assignedDentist?.firstName, assignedDentist?.lastName]
      .filter((part) => typeof part === "string" && part.trim())
      .join(" "),
    email: assignedDentist?.email,
    gdcNo: assignedDentist?.gdcNo,
  };
  const referralFormDetails = {
    referralDeatils: referralForm.other
      ? `${toTitleCase(referralForm.cbct ?? "")}, ${referralForm.other}`
      : toTitleCase(referralForm.dentalSpecialty ?? ""),
    treatmentDetails: referralForm.treatmentDetails,
    prescriptionDetails: referralForm.prescriptionDetails,
    attendTreatment: referralForm.attendTreatment === "yes" ? "yes" : "no",
    medicalHistoryPDF: referralForm.medicalHistoryPdf,
    cbctReportPdfUrl: referralForm.cbctReportPdf,
  };

  return (
    <div className="min-h-screen flex flex-col gap-5">
      <PageTopBar
        pageHeading="Referrals Details"
        showSearch={false}
        showFilters={false}
        showBackBtn={true}
        statusOptions={[]}
      />
      <PatientReferralDetails
        id={id}
        showModel={showModel}
        referralFormDetails={referralFormDetails}
        patientDetials={patientDetails}
        assignedDentistDetails={assignedDentistDetails}
      />
      {appointment && <AssignedAppointmentCard appointment={appointment} href={`/dentist/appointments/${appointment.id}/reports`} />}
    </div>
  );
}
