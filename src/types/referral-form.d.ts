export interface CreateReferralForm {
  name: string;
  DOB: Date;
  address: string;
  mobileNumber: string;
  email: string;
  referralName: string;
  referralGDC: string;
  referralAddress: string;
  referralMobileNumber: string;
  referralEmail: string;
  referralDetails: string[];
  treatMeantAppointment: string;
  medicalHistory?: string;
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
