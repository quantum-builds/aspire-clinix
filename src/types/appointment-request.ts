import { AppointmentRequestStatus } from "@prisma/client";
import { TAppointmentPagination } from "./appointment";

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
};

export type TAppointmentRequestResponse = {
  appointmentRequests: TAppointmentRequest[];
  pagination: TAppointmentPagination;
};
