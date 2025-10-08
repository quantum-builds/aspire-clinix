import { TDentist } from "./dentist";
import { TPatient } from "./patient";
import { TReferralRequest } from "./referral-request";

export interface CreateReferralForm {
  name: string;
  DOB: String;
  address: string;
  mobileNumber: string;
  email: string;
  referralName: string;
  referralGDC: string;
  referralAddress: string;
  referralMobileNumber: string;
  referralEmail: string;
  referralDetails?: string[];
  treatMeantAppointment?: string;
  // medicalHistory?: string;
  // medicalHistoryPdf?: string;
  treatmentDetails?: string;
}

export interface UpdateReferralForm {
  id: string;
  name?: string;
  DOB?: Date;
  address?: string;
  mobileNumber?: string;
  email?: string;
  referralName?: string;
  referralGDC?: string;
  referralAddress?: string;
  referralMobileNumber?: string;
  referralEmail?: string;
  referralDetails?: string[];
  treatMeantAppointment?: string;
  medicalHistory?: string;
  treatmentDetails?: string;
}

export type TCreateReferralForm = {
  patientName: string;
  patientPhoneNumber: string;
  patientEmail: string;
  patientDateOfBirth: Date;
  patientAddress: string;

  medicalHistoryPdfUrl?: string;
  referralDetails: string[];
  other?: string;
  treatmentDetails?: string;

  referralPracticeId: string;
  referralEmail: string;
  referralGDC: string;
  referralPhoneNumber: string;
  referralName: string;

  attendTreatment: string;
};

export type TReferralForm = TCreateReferralForm & {
  id: string;
  createdAt: Date;

  medicalHistoryPdf?:string;
  referralDentistId?: string;
  patientId?: string;
  referralDentist?: TDentist;
  patient?: TPatient;

  referralRequest?: TReferralRequest;
};
