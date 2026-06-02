import { calculateAge } from "@/utils/formatDateTime";
import NoContent1 from "@/app/(dashboards)/components/NoContent1";
import { getReferralRequest } from "@/services/referralRequest/referralRequestQuery";
import { TReferralRequest } from "@/types/referral-request";
import { Response } from "@/types/common";
import AssignedPatientDetails from "../components/AssignedPatientDetails";
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
  console.log("[ASSIGNED] referralRequestResponse ", referralRequestResponse);
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

  const patientDetails = {
    name: referralForm.patientName,
    phone: referralForm.patientPhoneNumber,
    email: referralForm.patientEmail,
    address: referralForm.patientAddress,
    // referralForm.referralDetails.map((disease) => toTitleCase(disease)).join(", "),
    age: String(calculateAge(referralForm.patientDateOfBirth)),
  };

  const dentistDetails = {
    name: referralForm.referralName,
    phone: referralForm.referralPhoneNumber,
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
    medicalHistoryPDF:
      referralForm.medicalHistoryPdf ?? referralForm.medicalHistoryPdfUrl,
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

      <AssignedPatientDetails
        id={id}
        showModel={showModel}
        referralFormDetails={referralFormDetails}
        patientDetials={patientDetails}
        assignedDentistDetails={dentistDetails}
        referralDentistDetails={assignedDentistDetails}
      />

      <AppointmentCard appointment={appointment} />
    </div>
  );
}
