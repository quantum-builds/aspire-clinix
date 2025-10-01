import { AppointmentRequestStatus } from "@prisma/client";
import { TAppointmentPagination } from "./appointment";
import { TPatient } from "./patient";

export type TAppointmentRequestCreate = {
  requestedDate: Date;
  reason: string;
  note?: string;
  fileUrl?: string;
};

export type TAppointmentRequest = TAppointmentRequestCreate & {
  id: string;
  status: AppointmentRequestStatus;
  file?: string;
  createdAt: string;
  patientId: string;

  patient?: TPatient;
};

export type TAppointmentRequestResponse = {
  appointmentRequests: TAppointmentRequest[];
  pagination: TAppointmentPagination;
};
