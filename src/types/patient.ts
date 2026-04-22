import { GenderType } from "@prisma/client";

export type TPatientCreate = {
  title: string
  firstName: string
  lastName: string
  mobilePhone: string
  email: string
  addressLine1: string
  postCode: string
  dateOfBirth: string
};

export type TPatient = Omit<TPatientCreate, "password"> & {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  file?: string;
};

export type patientQuery = {
  firstName?: string
  middleName?: string
  lastName?: string
  postcode?: string
  dateOfBirth?: string
  emailAddress?: string
  mobilePhone?: string
}

export const Title = {
  MR: "Mr",
  MRS: "Mrs",
  MISS: "Miss",
  MS: "Ms",
  DR: "Dr",
  MASTER: "Master",
  PROF: "Prof",
  HON: "Hon",
  REV: "Rev",
  SIR: "Sir",
  LADY: "Lady",
  LORD: "Lord",
  EARL: "Earl",
  JUDGE: "Judge",
  DAME: "Dame",
} as const;

export type Title = typeof Title[keyof typeof Title];