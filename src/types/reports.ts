import { ResoucrceType } from "@prisma/client";
import { TDentist } from "./dentist";

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
};

export type TReportResponse = {
  dentist:TDentist
  reports: { pdfs?: TReport[]; videos?: TReport[] };
};
