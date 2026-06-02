import { TDentist } from "./dentist";
import { TPatient, Patient } from "./patient";
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
  patientFirstName: string;
  patientLastName: string;
  patientPhoneNumber: string;
  patientEmail: string;
  patientDateOfBirth: Date;
  patientAddress: string;

  medicalHistoryPdfUrl?: string;
  cbct?: string;
  dentalSpecialty?: string;
  other?: string;
  treatmentDetails?: string;

  referralPracticeNameAddress: string;
  referralEmail: string;
  referralGDC: string;
  referralPhoneNumber: string;
  referralName: string;

  attendTreatment: string;
  practiceEmail?: string;
  practiceName?: string;
  practicePhoneNumber?: string;
};

export type TReferralForm = TCreateReferralForm & {
  id: string;
  createdAt: Date;
  dentalSpecialty ?: string;
  cbct ?: string;

  medicalHistoryPdf?: string;
  referralDentistId?: string;
  patientId?: string;
  referralDentist?: TDentist;
  patient?: Patient;
  

  referralRequest?: TReferralRequest;
};
