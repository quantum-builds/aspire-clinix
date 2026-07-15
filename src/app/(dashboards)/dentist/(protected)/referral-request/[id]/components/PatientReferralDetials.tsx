"use client";

import { usePathname } from "next/navigation";
import CustomButton from "@/app/(dashboards)/components/custom-components/CustomButton";
import ReferralFormDetailModal from "@/app/(dashboards)/components/ReferralFormDetailModal";
import ReferralProgressCard from "@/app/(dashboards)/components/ReferralProgressCard";
import DentistResponseForm from "./DentistResponseForm";
import { ReadOnlyCheckbox } from "@/components/ReadOnlyCheckBox";
import { DialogContent, DialogTitle } from "@/components/ui/dialog";
import { UploadPDFIcon } from "@/assets";
import PdfModal from "@/app/(dashboards)/components/ViewPdfModal";
import Image from "next/image";

interface PatientReferralDetailsProps {
  id: string;
  showModel: boolean;
  patientDetials: {
    name: string;
    age: string;
    phone: string;
    email: string;
    address: string;
  };
  dentistDetails: {
    name: string;
    gdcNo: string;
    phone: string;
    email: string;
    address: string;
  };
  referralFormDetails: {
    cbctReportPdfUrl: string | undefined;
    referralDetails: string;
    treatmentDetails?: string;
    prescriptionDetails?: string;
    attendTreatment: string;
    medicalHistoryPDF: string | undefined;
  };
  // New flow props
  requestStatus: string;
  assignedDentistId?: string | null;
  dentistResponseStatus?: string | null;
  dentistComments?: string | null;
  proposedTreatmentDetails?: string | null;
  proposedConsultationTime?: string | null;
  respondedAt?: string | null;
  isAssignedToMe: boolean;
  assignedDentistName?: string | null;
  assignedDentistEmail?: string | null;
}

export default function PatientReferralDetails({
  id,
  showModel,
  patientDetials,
  dentistDetails,
  referralFormDetails,
  requestStatus,
  assignedDentistId,
  dentistResponseStatus,
  dentistComments,
  proposedTreatmentDetails,
  proposedConsultationTime,
  respondedAt,
  isAssignedToMe,
  assignedDentistName,
  assignedDentistEmail,
}: PatientReferralDetailsProps) {
  const pathname = usePathname();
  const modalUrl = `${pathname}?showModal=true`;

  const hasResponded =
    dentistResponseStatus && dentistResponseStatus !== "PENDING";
  const canRespond =
    isAssignedToMe && requestStatus === "PENDING_REVIEW" && !hasResponded;

  return (
    <div className="bg-dashboardBarBackground w-full rounded-2xl px-6 py-6 space-y-3">
      <div className="w-full flex justify-between items-center">
        <p className="font-medium text-dashboardTextBlack text-2xl">
          Patient & Referral Dentist Details
        </p>
      </div>

      <div className="grid xl:grid-cols-2 gap-3">
        <div className="bg-gray px-5 py-4 space-y-2 rounded-2xl">
          <div className="flex items-center justify-between">
            <p className="text-green font-semibold text-xl">Patient Details</p>
          </div>
          <div className="flex text-[17px] items-center">
            <p className="flex-1">Name: {patientDetials.name}</p>
            <p className="flex-1">Age: {patientDetials.age}</p>
          </div>
          <div className="flex text-[17px] items-center">
            <p className="flex-1">Phone: {patientDetials.phone}</p>
            <p className="flex-1">Email: {patientDetials.email}</p>
          </div>
          <div className="flex justify-between items-center text-[17px]">
            <p>Address: {patientDetials.address}</p>
          </div>
        </div>

        <div className="bg-gray px-5 py-4 space-y-2 rounded-2xl">
          <div className="flex items-center justify-between">
            <p className="text-green font-semibold text-xl">
              Referral Dentist Details
            </p>
          </div>
          <div className="flex text-[17px] items-center">
            <p className="flex-1">Name: {dentistDetails.name}</p>
            <p className="flex-1">GDC no.: {dentistDetails.gdcNo}</p>
          </div>
          <div className="flex text-[17px] items-center">
            <p className="flex-1">Phone: {dentistDetails.phone}</p>
            <p className="flex-1">Email: {dentistDetails.email}</p>
          </div>
          <div className="flex justify-between items-center text-[17px]">
            <p>Practice Address: {dentistDetails.address}</p>
          </div>
        </div>
        <div className="bg-gray p-6 1xl50:space-y-5 space-y-0 rounded-2xl">
          <div className="flex justify-between items-center">
            <p className="text-green font-medium text-2xl max-1xl50:mb-3">
              Referral Form Details
            </p>
          </div>
          <div className="flex flex-col text-lg space-y-2">
            <div className="flex flex-row items-start">
              <p className="font-medium text-dashboardTextBlack w-40 shrink-0">
                Referral Details:
              </p>
              <p>{referralFormDetails.referralDetails}</p>
            </div>
            <div className="flex flex-row items-start">
              <p className="font-medium text-dashboardTextBlack w-40 shrink-0">
                Medical History:
              </p>
              <p>
                {referralFormDetails.treatmentDetails ? (
                  referralFormDetails.treatmentDetails
                ) : (
                  <span className="italic">No Medical History </span>
                )}
              </p>
            </div>
            <div className="flex flex-row items-start">
              <p className="font-medium text-dashboardTextBlack w-40 shrink-0">
                Prescription:
              </p>
              <p>
                {referralFormDetails.prescriptionDetails ? (
                  referralFormDetails.prescriptionDetails
                ) : (
                  <span className="italic">No Prescription Details </span>
                )}
              </p>
            </div>
          </div>
          <div className="flex justify-between items-center text-lg max-1xl50:pt-3">
            <div className="space-y-1">
              <p className="font-medium text-dashboardTextBlack">
                Would referral dentist like to attend the treatment appointment
                with the patient and shadow the dentist?
              </p>
              {referralFormDetails.attendTreatment === "yes" ? (
                <ReadOnlyCheckbox label="Yes" checked={true} />
              ) : (
                <ReadOnlyCheckbox label="No" checked={true} />
              )}
            </div>
          </div>
          <div className="flex gap-24">
            {referralFormDetails.medicalHistoryPDF && (
              <div className="flex flex-col">
                <h3 className="font-medium text-dashboardTextBlack mb-2">
                  Medical History
                </h3>

                <PdfModal
                  pdfUrl={referralFormDetails.medicalHistoryPDF}
                  trigger={
                    <div className="flex items-center gap-3 cursor-pointer">
                      <Image src={UploadPDFIcon} alt="PDF Icon" />
                      <p className="underline text-green">See Document</p>
                    </div>
                  }
                />
              </div>
            )}

            {referralFormDetails.cbctReportPdfUrl && (
              <div className="flex flex-col">
                <h3 className="font-medium text-dashboardTextBlack mb-2">
                  CBCT Report
                </h3>

                <PdfModal
                  pdfUrl={referralFormDetails.cbctReportPdfUrl}
                  trigger={
                    <div className="flex items-center gap-3 cursor-pointer">
                      <Image src={UploadPDFIcon} alt="PDF Icon" />
                      <p className="underline text-green">See Document</p>
                    </div>
                  }
                />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Progress Card - shown to all dentists who can view this referral */}
      {(hasResponded || isAssignedToMe) && (
        <ReferralProgressCard
          requestStatus={requestStatus}
          assignedDentist={
            assignedDentistName
              ? {
                  firstName: assignedDentistName.split(" ")[0] || "",
                  lastName:
                    assignedDentistName.split(" ").slice(1).join(" ") || "",
                  email: assignedDentistEmail || "",
                }
              : null
          }
          dentistResponseStatus={dentistResponseStatus}
          dentistComments={dentistComments}
          proposedTreatmentDetails={proposedTreatmentDetails}
          proposedConsultationTime={proposedConsultationTime}
          respondedAt={respondedAt}
        />
      )}

      {/* Response form - only for the assigned dentist who hasn't responded yet */}
      {canRespond && (
        <DentistResponseForm
          referralRequestId={id}
          existingComments={dentistComments}
          existingTreatment={proposedTreatmentDetails}
          existingTime={proposedConsultationTime}
        />
      )}

      {/* Already responded notice */}
      {hasResponded && isAssignedToMe && (
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 text-center">
          <p className="text-blue-700 font-medium">
            You have already responded to this referral.
          </p>
          <p className="text-blue-600 text-sm mt-1">
            Your response has been recorded. You can view the progress above.
          </p>
        </div>
      )}
    </div>
  );
}
