import { TDentist } from "./dentist";
import { TAppointment } from "./appointment";
import { TReferralForm } from "./referral-form";

export type TCreateReferralRequest = {
  referralFormId: string;
  assignedDentistId: string;
  appointmentId: string;
};

export type TReferralRequest = TCreateReferralRequest & {
  id: string;
  assignedDentist: TDentist;
  referralForm: TReferralForm;
  appointment: TAppointment;
};
