import { TDentist } from "./dentist";
import { TAppointment } from "./appointment";
import { TReferralForm } from "./referral-form";
import { ReferralRequestStatus } from "@prisma/client";

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
  assignedDentist?: TDentist;
  appointment?: TAppointment;
};

export type TReferralRequestPagination = {
  total: number;
  totalPages: number;
  page: number;
};

export type TReferralRequestResponse = {
  referralRequests: TReferralRequest[];
  pagination: TReferralRequestPagination;
};
