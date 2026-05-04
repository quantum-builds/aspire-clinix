import { TokenRoles } from "@/constants/UserRoles";

export type TPatientCreate = {
  title?: string;
  firstName: string;
  lastName: string;
  role?: TokenRoles
  mobilePhone?: string;
  email: string;
  gdcNo?:string
  addressLine1?: string;
  paymentPlanId?: string;
  postCode?: string;
  dateOfBirth?: Date;
  gender?: "male" | "female";
};

export type TPatient = Omit<TPatientCreate, "password"> & {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  file?: string;
};

export type Patient={
  id:string
  uuid:string
  dentallyId:string
  name:string
  mobileNumber:string
  email:string
  dateOfBirth:string
}

export type patientQuery = {
  firstName?: string;
  middleName?: string;
  lastName?: string;
  postcode?: string;
  dateOfBirth?: string;
  emailAddress?: string;
  mobilePhone?: string;
  familyId?: string;
};

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

export type Title = (typeof Title)[keyof typeof Title];
