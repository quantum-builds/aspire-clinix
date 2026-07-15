"use client";

import { useState } from "react";
import CustomButton from "@/app/(dashboards)/components/custom-components/CustomButton";
import BindAppointmentModal from "./BindAppointmentModal";
import AssignDentistModal from "./AssignDentistModal";
import ReferralProgressCard from "@/app/(dashboards)/components/ReferralProgressCard";
import PdfModal from "@/app/(dashboards)/components/ViewPdfModal";
import { ReadOnlyCheckbox } from "@/components/ReadOnlyCheckBox";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { UploadPDFIcon } from "@/assets";
import { showToast } from "@/utils/defaultToastOptions";
import { useUnassignDentistMutation } from "@/services/referralRequest/referralRequestMutation";
import { useQueryClient } from "@tanstack/react-query";

interface PatientReferralDetailsProps {
  id: string;
  showModel: boolean;
  patientDetials: {
    referenceId?: string;
    name: string;
    age: string;
    phone: string;
    email: string;
    address: string;
  };
  referralDentistDetails: {
    name: string;
    gdcNo: string;
    phone?: string;
    email: string;
    address: string;
  };
  referralFormDetails: {
    referralDeatils: string;
    treatmentDetails?: string;
    attendTreatment: string;
    medicalHistoryPDF?: string;
    cbctReportPdfUrl?: string | null;
    prescriptionDetails?: string;
    practicePhoneNumber?: string;
  };
  referralRequestId: string;
  requestStatus: string;
  assignedDentist?: {
    firstName: string;
    lastName: string;
    email: string;
    dentallyId?: number | null;
  } | null;
  dentistResponseStatus?: string | null;
  dentistComments?: string | null;
  proposedTreatmentDetails?: string | null;
  proposedConsultationTime?: string | null;
  respondedAt?: string | null;
}

export default function UnAssignedPatientDetails({
  id,
  showModel,
  referralFormDetails,
  patientDetials,
  referralDentistDetails,
  referralRequestId,
  requestStatus,
  assignedDentist,
  dentistResponseStatus,
  dentistComments,
  proposedTreatmentDetails,
  proposedConsultationTime,
  respondedAt,
}: PatientReferralDetailsProps) {
  const router = useRouter();
  const queryClient = useQueryClient();

  const [isBindModalOpen, setIsBindModalOpen] = useState(false);
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);

  const { mutate: unassignDentist, isPending: isUnassigning } =
    useUnassignDentistMutation();

  const handleAppointmentBound = () => {
    router.back();
    router.refresh();
  };

  const handleUnassign = () => {
    unassignDentist(
      { referralRequestId },
      {
        onSuccess: (data) => {
          if (data.status) {
            showToast("success", "Referral unassigned successfully");
            queryClient.invalidateQueries({ queryKey: ["referral-requests"] });
            router.refresh();
          } else {
            showToast("error", data.message || "Failed to unassign referral");
          }
        },
        onError: (error) => {
          showToast("error", error.message || "An error occurred");
        },
      },
    );
  };

  const showAssignBtn =
    requestStatus === "UNASSIGNED" || requestStatus === "REJECTED";
  const showReassignBtn = requestStatus === "REJECTED" && assignedDentist;
  const showBindBtn = requestStatus === "ACCEPTED";
  const showUnassignBtn =
    requestStatus === "PENDING_REVIEW" || requestStatus === "ACCEPTED";

  return (
    <div className="bg-white w-full rounded-2xl p-6 space-y-6">
      <div className="w-full flex justify-between items-center">
        <p className="font-medium text-dashboardTextBlack text-2xl">
          Patient & Referral Dentist Details
        </p>
        <div className="flex gap-3">
          {(showAssignBtn || showReassignBtn) && (
            <CustomButton
              text={showReassignBtn ? "Reassign Referral" : "Assign Referral"}
              style="primary"
              handleOnClick={() => setIsAssignModalOpen(true)}
            />
          )}
          {showUnassignBtn && (
            <CustomButton
              text="Unassign Referral"
              style="primary"
              // handleOnClick={handleUnassign}
              handleOnClick={() => setIsAssignModalOpen(true)}
            />
          )}
          {showBindBtn && (
            <CustomButton
              text="Bind with Appointment"
              style="primary"
              handleOnClick={() => setIsBindModalOpen(true)}
            />
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6">
        <div className="bg-gray p-6 1xl50:space-y-5 space-y-0 rounded-2xl">
          <div className="flex justify-between items-center">
            <p className="text-green font-medium text-2xl max-1xl50:mb-3">
              Patient
            </p>
          </div>
          <div className="flex items-start text-lg flex-col 1xl50:flex-row 1xl50:items-center">
            <p className="flex-1">Name: {patientDetials.name}</p>
            <p className="flex-1">Age: {patientDetials.age}</p>
          </div>
          <div className="flex items-start text-lg flex-col 1xl50:flex-row 1xl50:items-center">
            <p className="flex-1">Phone: {patientDetials.phone}</p>
            <p className="flex-1">Email: {patientDetials.email}</p>
          </div>
          <div className="flex justify-between items-center text-lg max-1xl50:pt-3">
            <p>Address: {patientDetials.address}</p>
          </div>
        </div>
        <div className="bg-gray p-6 1xl50:space-y-5 space-y-0 rounded-2xl">
          <div className="flex justify-between items-center">
            <p className="text-green font-medium text-2xl max-1xl50:mb-3">
              Referral Dentist and Practice
            </p>
          </div>
          <div className="flex items-start text-lg flex-col 1xl50:flex-row 1xl50:items-center">
            <p className="flex-1">Name: {referralDentistDetails.name}</p>
            <p className="flex-1">GDC no: {referralDentistDetails.gdcNo}</p>
          </div>
          <div className="flex items-start text-lg flex-col 1xl50:flex-row 1xl50:items-center">
            <p className="flex-1">Email: {referralDentistDetails.email}</p>
            <p className="flex-1">
              Practice Phone: {referralDentistDetails.phone}
            </p>
          </div>
          <div className="flex justify-between items-center text-lg max-1xl50:pt-3">
            <p>Practice Address: {referralDentistDetails.address}</p>
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
              <p>{referralFormDetails.referralDeatils}</p>
            </div>
            <div className="flex flex-row items-start">
              <p className="font-medium text-dashboardTextBlack w-40 shrink-0">
                Medical History:
              </p>
              <p>
                {referralFormDetails.treatmentDetails ? (
                  referralFormDetails.treatmentDetails
                ) : (
                  <span className="italic">No Description </span>
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

      <ReferralProgressCard
        requestStatus={requestStatus}
        assignedDentist={assignedDentist}
        dentistResponseStatus={dentistResponseStatus}
        dentistComments={dentistComments}
        proposedTreatmentDetails={proposedTreatmentDetails}
        proposedConsultationTime={proposedConsultationTime}
        respondedAt={respondedAt}
      />

      <BindAppointmentModal
        isOpen={isBindModalOpen}
        onClose={() => setIsBindModalOpen(false)}
        patientName={patientDetials.name}
        referralRequestId={referralRequestId}
        onAppointmentBound={handleAppointmentBound}
      />

      <AssignDentistModal
        isOpen={isAssignModalOpen}
        onClose={() => setIsAssignModalOpen(false)}
        referralRequestId={referralRequestId}
        currentlyAssignedDentistId={assignedDentist?.dentallyId ?? null}
      />
    </div>
  );
}
