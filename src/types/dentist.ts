import { DentistRole, GenderType } from "@prisma/client";
import { TDentistPractice } from "./dentistRequest";
import { S3File } from "@/services/s3/s3Query";

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
  file?: S3File | string | null;
};

export interface TDenstistResponse {
  dentist: TDentist;
  request: TDentistPractice | null;
}

export type Dentist = {
  id: string;
  email: string;
  gdcNo: string;
  firstName: string;
  lastName: string;
  dentallyId?: string;
  role: DentistRole;
};
