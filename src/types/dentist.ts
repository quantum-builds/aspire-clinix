import { DentistRole, GenderType } from "@prisma/client";
import { TDentistPractice } from "./dentistRequest";

export type TDentistCreate = {
  email: string;
  password: string;
  fullName: string;
  phoneNumber: string;
  country?: string;
  dateOfBirth?: Date;
  gender?: GenderType;
  gdcNo: string;
  practiceAddress: string;
  practiceId: string;
  role: DentistRole;
  fileUrl?: string;
};

export type TDentist = Omit<TDentistCreate, "password"> & {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  file?: string;
};

export interface TDenstistResponse {
  dentist: TDentist;
  request: TDentistPractice;
}
