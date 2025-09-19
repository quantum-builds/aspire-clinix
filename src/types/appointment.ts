import { PatientTreatmentStatus } from "@prisma/client";
import { TPatient } from "./patient";
import { TDentist } from "./dentist";

export type TAppointmentCreate = {
  patientId: string;
  dentistId: string;
  reason: string;
  state: PatientTreatmentStatus;
  date: Date;
};

export type TAppointment = TAppointmentCreate & {
  id: string;
  patient: TPatient;
  dentist: TDentist;
};

export type TAppointmentPagination = {
  total: number;
  totalPages: number;
  page: number;
};

export type TAppointmentResponse = {
  appointments: TAppointment[];
  pagination: TAppointmentPagination;
};
