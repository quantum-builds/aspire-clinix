import { ResoucrceType } from "@prisma/client";
import { StaticImageData } from "next/image";

export interface Response<T> {
  status: boolean;
  message: string;
  data: T;
}

export type SidebarPage = {
  name: string;
  icon: StaticImageData;
  href?: string;
  pages?: SidebarPage[];
};

export type TPaginationNumbers = {
  total: number;
  totalPages: number;
};

export type TDentistDeatils = {
  id: string;
  name: string;
  gdcNo: string;
  phoneNo: string;
  email: string;
  date: string;
  time: string;
  appointmentNumber: string;
  practiceAddress: string;
};

export type TReport = {
  id: string;
  title: string;
  fileUrl: string;
  fileType: ResoucrceType;
  createdAt: Date;
};

export type TProduct = {
  id: string;
  title: string;
  stars: number;
  fileName: string;
  fileUrl: string;
  price: number;
  stock: number;
};

export type TCartProduct = {
  id: string;
  cartId: string;
  quantity: number;
  price: number;
  total: number;
  fileName: string;
  fileUrl: string;
  title: string;
};

export type TPlan = {
  id: string;
  name: string;
  title: string;
  price: string;
  target: string;
  services: string[];
};

export type TPurchasedProduct = {
  cartId: string;
  products: {
    productId: string;
    quantity: number;
  }[];
};

export type TUpcomingAppointmentPatient = {
  date: string;
  time: string;
  appointmentNumber: string;
  disease: string;
  dentistId: string;
  dentistName: string;
  gdcNumber: string;
  dentistPhone: string;
  dentistEmail: string;
  practiceAddress: string;
  specialization: string;
};

export type TPastAppointmentPatient = {
  date: string;
  time: string;
  appointmentNumber: string;
  dentistId: string;
  dentistName: string;
  gdcNumber: string;
  dentistPhone: string;
  disease: string;
};

export type TAppointmentDentist = {
  date: string;
  time: string;
  appointmentNumber: string;
  disease: string;
  patientId: string;
  patientName: string;
  patientGender: string;
  patientAge: string;
  patientPhone: string;
};

export type TPatientDetails = TAppointmentDentist & {
  patientEmail: string;
};

export type TReferralRequestDataTable = {
  id: string;
  patientName: string;
  referringDentistName: string;
  disease: string;
  referralDate: string;
};

export type TReferraLRequestCards = {
  totalReferrals: TTotalReferrals;
  attendedReferrals: TAttendedReferrals;
  unattendedReferrals: TUnAttendedReferrals;
  averageReferrals: TAverageReferrals;
};

export type TTotalReferrals = {
  count: number;
  percentageChange: number;
};

export type TAttendedReferrals = TTotalReferrals;
export type TUnAttendedReferrals = TTotalReferrals;

export type TAverageReferrals = {
  percentage: number;
  percentageChange: number;
};

export enum FILE_TYPE {
  VIDEO = "video",
  PDF = "pdf",
  IMAGES = "images",
}

export enum AppointmentDateType {
  UPCOMING = "UPCOMING",
  PAST = "PAST",
}
