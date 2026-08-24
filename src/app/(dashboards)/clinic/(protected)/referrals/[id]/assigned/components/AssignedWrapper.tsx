import { calculateAge } from "@/utils/formatDateTime";
import NoContent1 from "@/app/(dashboards)/components/NoContent1";
import { getReferralRequest } from "@/services/referralRequest/referralRequestQuery";
import { TReferralRequest } from "@/types/referral-request";
import { Response } from "@/types/common";
import AssignedPatientDetails from "../components/AssignedPatientDetails";
import ReferralProgressCard from "@/app/(dashboards)/components/ReferralProgressCard";
import PageTopBar from "@/app/(dashboards)/components/custom-components/PageTopBar";
import { toTitleCase } from "@/utils/formatWords";
import AppointmentCard from "./AppointmentCard";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

interface AssignedWrapperProps {
  id: string;
  showModel: boolean;
}
export default async function AssignedWrapper({
  id,
  showModel,
}: AssignedWrapperProps) {
  const referralRequestResponse: Response<TReferralRequest> =
    await getReferralRequest(id);

  const session = await getServerSession(authOptions);
  const role = session?.user.role;

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
  if (
    !referralRequestResponse.data.assignedDentist ||
    !referralRequestResponse.data.appointment
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
        <NoContent1 text="Referral is not assigned yet!!!" />
      </div>
    );
  }

  const referralForm = referralRequestResponse.data.referralForm;
  const assignedDentist = referralRequestResponse.data.assignedDentist;
  const appointment = referralRequestResponse.data.appointment;
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
    phone: referralForm.practicePhoneNumber,
    email: referralForm.referralEmail,
    gdcNo: referralForm.referralGDC,
    address: referralForm.patientAddress,
  };

  const assignedDentistDetails = {
    name: `${assignedDentist?.firstName} ${assignedDentist.lastName}`,
    email: assignedDentist?.email,
    gdcNo: assignedDentist?.gdcNo,
  };

  const referralFormDetails = {
    referralDeatils: referralForm.other
      ? `${toTitleCase(referralForm.cbct ?? "")}, ${referralForm.other}`
      : toTitleCase(referralForm.dentalSpecialty ?? ""),
    treatmentDetails: referralForm.treatmentDetails,
    attendTreatment: referralForm.attendTreatment === "yes" ? "yes" : "no",
    medicalHistoryPDF: (() => {
      const raw = referralForm.medicalHistoryPdf ?? referralForm.medicalHistoryPdfUrl;
      if (Array.isArray(raw)) return raw;
      if (raw) return [raw];
      return [];
    })(),
    cbctReportPdfUrl:
      referralForm.cbctReportPdf ?? referralForm.cbctReportPdfUrl,
    prescriptionDetails: referralForm.prescriptionDetails,
  };

  const assignedDentistInfo = referralRequest.assignedDentist
    ? {
        firstName: referralRequest.assignedDentist.firstName,
        lastName: referralRequest.assignedDentist.lastName,
        email: referralRequest.assignedDentist.email,
      }
    : null;

  return (
    <div className="min-h-screen flex flex-col gap-5">
      <PageTopBar
        pageHeading="Referrals Details"
        showSearch={false}
        showFilters={false}
        showBackBtn={true}
        statusOptions={[]}
      />

      <AssignedPatientDetails
        id={id}
        showModel={showModel}
        referralFormDetails={referralFormDetails}
        patientDetials={patientDetails}
        assignedDentistDetails={assignedDentistDetails}
        referralDentistDetails={dentistDetails}
      />

      <ReferralProgressCard
        requestStatus={referralRequest.requestStatus}
        assignedDentist={assignedDentistInfo}
        dentistResponseStatus={referralRequest.dentistResponseStatus}
        dentistComments={referralRequest.dentistComments}
        proposedTreatmentDetails={referralRequest.proposedTreatmentDetails}
        proposedConsultationTime={referralRequest.proposedConsultationTime}
        respondedAt={referralRequest.respondedAt ? referralRequest.respondedAt.toString() : null}
      />

      <AppointmentCard appointment={appointment}  href={`/clinic/appointments/${appointment.id}/reports`} />
    </div>
  );
}
