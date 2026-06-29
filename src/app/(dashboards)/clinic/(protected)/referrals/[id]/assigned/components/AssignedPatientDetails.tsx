"use client";

import CustomButton from "@/app/(dashboards)/components/custom-components/CustomButton";
import ReferralFormDetailModal from "@/app/(dashboards)/components/ReferralFormDetailModal";
import PdfModal from "@/app/(dashboards)/components/ViewPdfModal";
import { ReadOnlyCheckbox } from "@/components/ReadOnlyCheckBox";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { UploadPDFIcon } from "@/assets";

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
  assignedDentistDetails: {
    name: string;
    gdcNo: string;
    phone?: string;
    email: string;
    address?: string;
  };
  referralDentistDetails: {
    name: string;
    gdcNo: string;
    email: string;
    phone?: string;
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
}

export default function AssignedPatientDetails({
  id,
  showModel,
  referralFormDetails,
  patientDetials,
  assignedDentistDetails,
  referralDentistDetails,
}: PatientReferralDetailsProps) {
  const pathname = usePathname();
  const modalUrl = `${pathname}?showModal=true`;

  return (
    <div className="bg-white w-full rounded-2xl p-6 space-y-6">
      <div className="w-full flex justify-between items-center">
        <p className="font-medium text-dashboardTextBlack text-2xl">
          Patient & Referral Dentist Details
        </p>
        <CustomButton
          text="See Referral Form Details"
          style="secondary"
          href={modalUrl}
        />
      </div>

      <div className="bg-gray p-6 space-y-5 rounded-2xl">
        <div className="flex items-center justify-between">
          <p className="text-2xl font-medium text-green">Patient</p>
        </div>
        <div className="flex  1xl:gap-[100px] gap-10 text-lg">
          <div className="space-y-3">
            <p>Name: {patientDetials.name}</p>
            <p>Phone: {patientDetials.phone}</p>
          </div>
          <div className="space-y-3">
            <p>Age: {patientDetials.age}</p>
            <p>Email: {patientDetials.email}</p>
          </div>
          <div className="space-y-3">
            <p>Address: {patientDetials.address}</p>
          </div>
        </div>
        <div className="flex items-center gap-[100px] text-lg"></div>
      </div>

      <div className="grid grid-cols-2 gap-6">
        <div className="bg-gray p-6 1xl50:space-y-5 space-y-0 rounded-2xl">
          <div className="flex justify-between items-center">
            <p className="text-green font-medium text-2xl max-1xl50:mb-3">
              Assigned Dentist
            </p>
          </div>
          <div className="flex items-start text-lg flex-col 1xl50:flex-row 1xl50:items-center">
            <p className="flex-1">Name: {assignedDentistDetails.name}</p>
            <p className="flex-1">GDC no: {assignedDentistDetails.gdcNo}</p>
          </div>
          <div className="flex items-start text-lg flex-col 1xl50:flex-row 1xl50:items-center">
            <p className="flex-1">Email: {assignedDentistDetails.email}</p>
          </div>
          <div className="flex justify-between items-center text-lg max-1xl50:pt-3"></div>
        </div>
        <div className="bg-gray p-6 rounded-2xl space-y-5">
          <div>
            <p className="text-green font-medium text-2xl">
              Referral Dentist and Practice
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-lg">
            <p>
              <span className="font-medium">Name:</span>{" "}
              {referralDentistDetails.name}
            </p>

            <p>
              <span className="font-medium">GDC No.:</span>{" "}
              {referralDentistDetails.gdcNo}
            </p>

            <p>
              <span className="font-medium">Email:</span>{" "}
              {referralDentistDetails.email}
            </p>

            <p>
              <span className="font-medium">Practice Phone:</span>{" "}
              {referralDentistDetails.phone}
            </p>

            <p className="md:col-span-2">
              <span className="font-medium">Practice Address:</span>{" "}
              {referralDentistDetails.address}
            </p>
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
                  <span className="italic">NO Description Added</span>
                )}
              </p>
            </div>
            <div className="flex flex-row items-start">
              <p className="font-medium text-dashboardTextBlack w-40 shrink-0">
                Prescription :
              </p>
              <p>
                {referralFormDetails.prescriptionDetails ? (
                  referralFormDetails.prescriptionDetails
                ) : (
                  <span className="italic">No Prescription Details Added</span>
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
    </div>
  );
}
