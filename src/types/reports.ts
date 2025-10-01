import { ResoucrceType } from "@prisma/client";
import { TDentist } from "./dentist";
import { TPatient } from "./patient";

export type TReportCreate = {
  patientId: string;
  appointmentId: string;
  title: string;
  fileUrl: string;
  fileType: ResoucrceType;
};

export type TReport = TReportCreate & {
  id: string;
  dentistId: string;
  file?: string;
  createdAt: Date;
  updatedAt: Date;
  patient?: TPatient;
  dentist?: TDentist;
};

export type TReportResponse = {
  reports: { pdfs?: TReport[]; videos?: TReport[] };
};
