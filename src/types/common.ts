import { ResoucrceType } from "@prisma/client";
import { StaticImageData } from "next/image";

export interface Response<T> {
  status: boolean;
  message: string;
  data: T;
}

export interface SidebarPage {
  name: string;
  icon: StaticImageData;
  href?: string;
  pages?: SidebarPage[];
}

export interface TPaginationNumbers {
  total: number;
  totalPages: number;
}

export interface TDentistDeatils {
  id: string;
  name: string;
  gdcNo: string;
  phoneNo: string;
  email: string;
  date: string;
  time: string;
  appointmentNumber: string;
  practiceAddress: string;
}

export interface TReport {
  id: string;
  title: string;
  fileUrl: string;
  fileType: ResoucrceType;
  createdAt: Date;
}

export type TResource = TReport;

export interface TProduct {
  id: string;
  title: string;
  stars: number;
  fileName: string;
  fileUrl: string;
  price: number;
  stock: number;
}

export interface TCartProduct {
  id: string;
  cartId: string;
  quantity: number;
  price: number;
  total: number;
  fileName: string;
  fileUrl: string;
  title: string;
}

export interface TPlan {
  id: string;
  name: string;
  title: string;
  price: string;
  target: string;
  services: string[];
}

export interface TPurchasedProduct {
  cartId: string;
  products: {
    productId: string;
    quantity: number;
  }[];
}

export interface TUpcomingAppointmentPatient {
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
}

export interface TPastAppointmentPatient {
  date: string;
  time: string;
  appointmentNumber: string;
  dentistId: string;
  dentistName: string;
  gdcNumber: string;
  dentistPhone: string;
  disease: string;
}

export interface TAppointmentDentist {
  date: string;
  time: string;
  appointmentNumber: string;
  disease: string;
  patientId: string;
  patientName: string;
  patientGender: string;
  patientAge: string;
  patientPhone: string;
}

export interface TPatientDetails extends TAppointmentDentist {
  patientEmail: string;
}

export interface TReferralRequestDataTable {
  id: string;
  patientName: string;
  referringDentistName: string;
  disease: string;
  referralDate: string;
}

export interface TReferraLRequestCards {
  totalReferrals: TTotalReferrals;
  attendedReferrals: TAttendedReferrals;
  unattendedReferrals: TUnAttendedReferrals;
  averageReferrals: TAverageReferrals;
}

export interface TTotalReferrals {
  count: number;
  percentageChange: number;
  icon: string;
  title: string;
  link?: string;
}

export type TAttendedReferrals = TTotalReferrals;
export type TUnAttendedReferrals = TTotalReferrals;
export interface TAverageReferrals {
  count: number;
  percentageChange: number;
  icon: string;
  title: string;
}

export interface AppointmentDetails {
  date: string;
  time: string;
  status: string;
  appointmentNumber: string;
}

export type TReferralHistoryStatus = "Assigned" | "Unassigned";

export interface TReferralHistoryDataTable {
  referenceId: string;
  patientName: string;
  status: TReferralHistoryStatus;
  disease: string;
  referralDate: string;
}

export type TLoyaltyPointsCards = {
  [key: string]: {
    title: string;
    points: number;
  };
};

export interface TLoyaltyPointsDataTable {
  referenceId: string;
  patientName: string;
  dentistName: string;
  earnedPoints: number;
  otherPoints: number;
  referralDate: string;
}

export enum FILE_TYPE {
  VIDEO = "video",
  PDF = "pdf",
  IMAGES = "images",
}
