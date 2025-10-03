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


export type TCreateReferralForm={
  patientName:string
  patientPhoneNumber:string
  patientEmail:string
  patientDateOfBirth:Date
  patientAddress:string

  medicalHistoryPdfUrl?:string
  referralDetail:string[]

}
