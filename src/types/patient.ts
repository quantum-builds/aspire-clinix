import { GenderType } from "@prisma/client";

export type TPatientCreate = {
  email: string;
  password: string;
  fullName: string;
  phoneNumber: string;
  country: string;
  dateOfBirth: Date;
  gender: GenderType;
};

export type TPatient = Omit<TPatientCreate, "password"> & {
  id: string;
  createdAt: Date;
  updatedAt: Date;
};
