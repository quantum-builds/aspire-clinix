import { AppointmentRequestStatus } from "@prisma/client";
import { TAppointmentPagination } from "./appointment";
import { TPatient } from "./patient";

export type TAppointmentRequestCreate = {
  patientId: string;
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

  patient?: TPatient;
};

export type TAppointmentRequestResponse = {
  appointmentRequests: TAppointmentRequest[];
  pagination: TAppointmentPagination;
};
