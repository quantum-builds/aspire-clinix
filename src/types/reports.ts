import { ResoucrceType } from "@prisma/client";
import { Dentist, TDentist } from "./dentist";
import { Patient, TPatient } from "./patient";

export type TReportCreate = {
  patientDentallyId: string;
  appointmentId: string;
  title: string;
  fileUrl: string;
  fileType: ResoucrceType;
  recipientType: ReportRecipient;
  recipientId?: string;
};

export type TReport = TReportCreate & {
  id: string;
  dentistId: string;
  file?: string;
  createdAt: Date;
  updatedAt: Date;
  patient?: Patient;
  dentist?: Dentist;
};

export type TReportResponse = {
  reports: { pdfs?: TReport[]; videos?: TReport[] };
};

export enum ReportRecipient {
  PATIENT = "PATIENT",
  REFERRING_DENTIST = "REFERRING_DENTIST",
}
