import { Patient, TPatient } from "./patient";
import { TReport } from "./reports";

export type TAppointment = {
  bindStatus?: "BOUND" | "UNBOUND";
  id: number;
  appointmentCancellationReasonId: number | null;
  arrivedAt: string | null;
  bookedViaApi: boolean;
  cancelledAt: string | null;
  completedAt: string | null;
  confirmedAt: string | null;
  createdAt: string;
  didNotAttendAt: string | null;
  duration: number;
  finishTime: string;
  importId: string | null;
  inSurgeryAt: string | null;
  metadata: Record<string, unknown>;
  notes: string | null;
  patientId: number;
  patientImageUrl: string;
  patientName: string;
  paymentPlanId: number | null;
  pendingAt: string | null;
  practitionerId: number;
  reason: string;
  roomId: number | null;
  startTime: string;
  state: AppointmentState;
  treatmentDescription: string | null;
  updatedAt: string;
  userId: number;
  practitionerSiteId: string;
  practitionerName: string;
  uuid: string;
};

export type TChangeAppointmentState = {
  state: AppointmentState;
};

export type TAppointmentPagination = {
  total: number;
  currentPage: number;
  totalPages: number;
};

export type TAppointmentResponse = {
  appointmentRequests: any;
  appointments: TAppointment[];
  meta: TAppointmentPagination;
};

// DENTALLY TYPES

export interface CreateAppointment {
  startTime: Date;
  finishTime: Date;
  practitionerId: number;
  reason: AppointmentReason;
  patientId?: number;
  state?: AppointmentState;
  notes?: string;
  metadata?: Record<string, any>;
  forceChanges?: boolean;
}

export interface Appointment {
  // Identifiers
  id: number;
  uuid: string;

  // Core
  duration: number;
  reason: string;
  notes?: string;
  treatmentDescription?: string;
  metadata?: Record<string, unknown>;

  // Patient
  patientId: number;
  patientName: string;
  patientImageUrl?: string;
  paymentPlanId?: number;

  // Assignment
  practitionerId: number;
  roomId?: string;
  createdByUserId: number;

  // Timeline
  startTime: string;
  finishTime: string;
  pendingAt?: string;
  confirmedAt?: string;
  arrivedAt?: string;
  inSurgeryAt?: string;
  completedAt?: string;
  cancelledAt?: string;
  didNotAttendAt?: string;

  // State
  state: string;

  // Cancellation
  cancellationReasonId?: string;

  // System
  bookedViaApi: boolean;
}

export interface ListAppointment {
  page?: number;
  perPage?: number;
  on?: Date;
  before?: Date;
  after?: Date;
  updatedAfter?: Date;
  practitionerId?: string;
  patientId?: string;
  roomId?: string;
  siteId?: string;
  state?: AppointmentState;
  cancelled?: boolean;
}

export interface AvailableAppointments {
  startTime: Date;
  finishTime: Date;
  practitionerIds: number[];
  duration?: number;
  page?: number;
  perPage?: number;
}

export interface AppointmentReasonDetails {
  colour: string;
  deleted: boolean;
  exam: boolean;
  hygiene: boolean;
  position: number;
  reason?: string;
}

enum AppointmentReason {
  EXAM = "Exam",
  SCALEANDPOLISH = "Scale & Polish",
  EXAMANDSCALEANDPOLISH = "Exam + Scale & Polish",
  CONTINUINGTREATMENT = "Continuing Treatment",
  EMERGENCY = "Emergency",
  REVIEW = "Review",
  OTHER = "Other",
}

export enum AppointmentState {
  PENDING = "Pending",
  CONFIRMED = "Confirmed",
  ARRIVED = "Arrived",
  INSURGERY = "In surgery",
  COMPLETED = "Completed",
  CANCELLED = "Cancelled",
  DIDNOTATTEND = "Did not attend",
}

export interface TAppointmentDetail {
  appointment: TAppointment;

  reports: {
    pdfs?: TReport[];
    videos?: TReport[];
  };

  patient: Patient | null;
}
