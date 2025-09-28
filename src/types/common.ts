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

export type TResource = TReport;
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
  type?: string;
};

export type TPurchasedProduct = {
  cartId: string;
  products: {
    id: string;
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
  icon: string;
  title: string;
  link?: string;
};

export type TAttendedReferrals = TTotalReferrals;
export type TUnAttendedReferrals = TTotalReferrals;
export interface TAverageReferrals {
  count: number;
  percentageChange: number;
  icon: string;
  title: string;
  link?: string;
}

export interface AppointmentDetails {
  date: string;
  time: string;
  status: string;
  appointmentNumber: string;
}

export type TAppointmentRequestStatus = "Approved" | "Pending" | "Cancel";
export interface TAppointmentRequests {
  id: string;
  reason: string;
  status: TAppointmentRequestStatus;
  requestDate: Date;
}

export type TAppointmentRequestCards = {
  totalRequests: TTotalRequests;
  approvedRequest: TApprovedRequests;
  pendingRequests: TPendingRequests;
  cancelRequests: TCancelRequests;
};

export type TTotalRequests = {
  count: number;
  percentageChange: number;
  icon: string;
  title: string;
  link?: string;
  statusParam?: string;
};

export type TApprovedRequests = TTotalRequests;
export type TPendingRequests = TTotalRequests;
export type TCancelRequests = TTotalRequests;

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

export enum AppointmentDateType {
  UPCOMING = "UPCOMING",
  PAST = "PAST",
}

export interface TAppointmentClinic {
  date: string;
  time: string;
  appointmentNumber: string;
  patientName: string;
  patientGender: string;
  patientAge: string;
  disease: string;
  patientId: string;
  dentistName: string;
}

export interface TClinicReferralDataTable {
  referenceId: string;
  patientName: string;
  dentistName: string;
  referralDentistName: string;
  disease: string;
  status: TReferralHistoryStatus;
  referralDate: string;
}

export interface AppointmentRequest {
  id: string;
  date: string;
  time: string;
  patientName: string;
  patientEmail: string;
  patientPhone: string;
  disease: string;
  appointmentDate: string;
  appointmentReason: string;
  additionalNote: string;
}

export interface TStatusOption {
  value: string;
}
