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
  recipientType: String;
};

export type TReportResponse = {
  reports: { pdfs?: TReport[]; videos?: TReport[] };
};

export enum ReportRecipient {
  REFERRING_DENTIST = "REFERRING_DENTIST",
  BOTH = "BOTH",
}

export const REPORT_RECIPIENT_LABELS: Record<string, string> = {
  REFERRING_DENTIST: "Referring Dentist",
};
