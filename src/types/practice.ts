import { TAppointment } from "./appointment";
import { TDentist } from "./dentist";

export interface OpeningHour {
  open: string;
  close: string;
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

export interface TPractice {
  id: string;
  email: string;
  name: string;
  phoneNumber: string;
  postcode: string;
  timeZone: string;
  town: string;
  nhs: boolean;
  openingHours: OpeningHours;
  addressLine1: string;
  addressLine2: string;
  logoUrl: string;
  logo?: string;

  dentists?: TDentist[];
  appointments?: TAppointment[];
}
