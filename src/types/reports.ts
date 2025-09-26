import { ResoucrceType } from "@prisma/client";
import { TDentist } from "./dentist";
import { TPatient } from "./patient";

export type TReport = {
  id: string;
  dentistId: string;
  patientId: string;
  appointmentId: string;
  title: string;
  fileUrl: string;
  fileType: ResoucrceType;
  file?: string;
  createdAt: Date;
  updatedAt: Date;
  patient?: TPatient;
  dentist?: TDentist;
};

export type TReportResponse = {
  dentist?: TDentist;
  reports: { pdfs?: TReport[]; videos?: TReport[] };
};
