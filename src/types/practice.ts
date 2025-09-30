import { TAppointment } from "./appointment";
import { TDentist } from "./dentist";

export interface OpeningHour {
  open: Date;
  close: Date;
}

export interface OpeningHours {
  Monday?: OpeningHour;
  Tuesday?: OpeningHour;
  Wednesday?: OpeningHour;
  Thursday?: OpeningHour;
  Friday?: OpeningHour;
  Saturday?: OpeningHour;
  Sunday?: OpeningHour;
}

export type TPracticeCreate = {
  email: string;
  name: string;
  nhs: boolean;
  openingHours: OpeningHours;
  addressLine1: string;
  addressLine2: string;
  phoneNumber: string;
  postcode: string;
  timeZone: string;
  town: string;
  logoUrl?: string;
};

export type TPractice = TPracticeCreate & {
  id: string;
  logo?: string;
  dentists?: TDentist[];
  appointments?: TAppointment[];
};

export type TPracticePagination = {
  total: number;
  totalPages: number;
  page: number;
};

export type TPracticeResponse = {
  practices: TPractice[];
  pagination: TPracticePagination;
};
