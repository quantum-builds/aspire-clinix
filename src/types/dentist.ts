import { DentistRole, GenderType } from "@prisma/client";

export type TDentistCreate = {
  email: string;
  password: string;
  fullName: string;
  phoneNumber: string;
  country: string;
  dateOfBirth: Date;
  gender: GenderType;
  gdcNo: string;
  practiceAddress: string;
  role: DentistRole;
};

export type TDentist = Omit<TDentistCreate, "password"> & {
  id: string;
  createdAt: Date;
  updatedAt: Date;
};
