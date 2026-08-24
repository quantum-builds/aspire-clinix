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
import prisma from "@/lib/db";

interface ReferralRequestDetailProps {
  id: string;
  showModel: boolean;
}

export default async function ReferralRequestDetail({
  id,
  showModel,
}: ReferralRequestDetailProps) {
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

  const referralForm = referralRequestResponse.data.referralForm;
  const appointment = referralRequestResponse.data.appointment;
  const referralRequest = referralRequestResponse.data;

  // Resolve if the logged-in dentist is the assigned dentist
  let isAssignedToMe = false;
  if (
    role === "DENTALLY_PRACTITIONER" &&
    session?.user?.id &&
    referralRequest.assignedDentistId
  ) {
    const dentallyId = Number(session.user.id);
    if (!Number.isNaN(dentallyId)) {
      const dentist = await prisma.dentist.findFirst({
        where: { dentallyId },
        select: { id: true },
      });
      isAssignedToMe = dentist?.id === referralRequest.assignedDentistId;
    }
  }

  const patientDetails = {
    name: referralForm.patientName,
    phone: referralForm.patientPhoneNumber,
    email: referralForm.patientEmail,
    address: referralForm.patientAddress,
    age: String(calculateAge(referralForm.patientDateOfBirth)),
  };

  const dentistDetails = {
    name: referralForm.referralName,
    phone: (referralForm as any).referralPhoneNumber || referralForm.practicePhoneNumber || "",
    email: referralForm.referralEmail,
    gdcNo: referralForm.referralGDC,
    address: referralForm.patientAddress,
  };
   const referralType = referralForm.cbct
    ? referralForm.cbct
    : referralForm.dentalSpecialty
      ? toTitleCase(referralForm.dentalSpecialty)
      : "Not specified";
  const referralDetails = referralForm.other
    ? `${referralType}, ${referralForm.other}`
    : referralType;

  const referralFormDetails = {
    referralDetails: referralDetails,
    treatmentDetails: referralForm.treatmentDetails,
    prescriptionDetails: referralForm.prescriptionDetails,
    attendTreatment: referralForm.attendTreatment === "yes" ? "yes" : "no",
    medicalHistoryPDF: (() => {
      const raw = referralForm.medicalHistoryPdf ?? referralForm.medicalHistoryPdfUrl;
      if (Array.isArray(raw)) return raw;
      if (raw) return [raw];
      return [];
    })(),
  };

  const assignedDentistName = referralRequest.assignedDentist
    ? `${referralRequest.assignedDentist.firstName} ${referralRequest.assignedDentist.lastName}`
    : null;
  const assignedDentistEmail = referralRequest.assignedDentist?.email ?? null;

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
        requestStatus={referralRequest.requestStatus}
        assignedDentistId={referralRequest.assignedDentistId}
        dentistResponseStatus={referralRequest.dentistResponseStatus}
        dentistComments={referralRequest.dentistComments}
        proposedTreatmentDetails={referralRequest.proposedTreatmentDetails}
        proposedConsultationTime={referralRequest.proposedConsultationTime}
        respondedAt={
          referralRequest.respondedAt
            ? referralRequest.respondedAt.toString()
            : null
        }
        isAssignedToMe={isAssignedToMe}
        assignedDentistName={assignedDentistName}
        assignedDentistEmail={assignedDentistEmail}
      />

      {appointment && (
        <AppointmentCard appointment={appointment} role={role ?? ""} />
      )}
    </div>
  );
}
