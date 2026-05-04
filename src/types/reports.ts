import { ResoucrceType } from "@prisma/client";
import { Dentist, TDentist } from "./dentist";
import { Patient, TPatient } from "./patient";

export type TReportCreate = {
  patientDentallyId: string;
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
  patient?: Patient;
  dentist?: Dentist;
};

export type TReportResponse = {
  reports: { pdfs?: TReport[]; videos?: TReport[] };
};
