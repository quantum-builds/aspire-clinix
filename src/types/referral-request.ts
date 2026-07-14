import { Dentist, TDentist } from "./dentist";
import { TAppointment } from "./appointment";
import { TReferralForm } from "./referral-form";
import { ReferralRequestStatus, DentistResponseStatus } from "@prisma/client";

export type TCreateReferralRequest = {
  referralFormId: string;
  requestStatus: ReferralRequestStatus;
  assignedDentistId?: string;
  appointmentId?: string;
};

export type TReferralRequest = TCreateReferralRequest & {
  id: string;
  createdAt: Date;
  referralForm: TReferralForm;
  assignedDentist?: Dentist;
  appointment?: TAppointment;
  isPractitioner?: boolean;
  isReferringDentistFromDentally?: boolean;
  dentistResponseStatus?: DentistResponseStatus | null;
  dentistComments?: string | null;
  proposedTreatmentDetails?: string | null;
  proposedConsultationTime?: string | null;
  respondedAt?: Date | null;
};

export type TReferralRequestPagination = {
  total: number;
  totalPages: number;
  page: number;
};

export type TReferralRequestResponse = {
  file: any;
  fileUrl: any;
  referralRequests: TReferralRequest[];
  pagination: TReferralRequestPagination;
};

export type TReferralRequestStasts = {
  totalReferrals: {
    count: number,
    percentageChange: number
  };
  assignedReferrals: {
    count: number,
    percentageChange: number
  };
  unassignedReferrals: {
    count: number,
    percentageChange: number
  };
  averageReferrals: {
    count: number,
    percentageChange: number
  };
}