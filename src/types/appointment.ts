import { AppointmentStatus } from "@prisma/client";
import { TPatient } from "./patient";
import { TDentist } from "./dentist";

export type TAppointmentCreate = {
  patientId: string;
  dentistId: string;
  practiceId: string;
  reason: string;
  state: AppointmentStatus;
  date: Date;
  startTime: Date;
  finishTime: Date;
};

export type TAppointment = TAppointmentCreate & {
  id: string;
  patient: TPatient;
  dentist: TDentist;
};

export type TAppointmentPagination = {
  total: number;
  totalPages: number;
  page: number;
};

export type TAppointmentResponse = {
  appointments: TAppointment[];
  pagination: TAppointmentPagination;
};

// DENTALLY

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

enum AppointmentState {
  PENDING = "Pending",
  CONFIRMED = "Confirmed",
  ARRIVED = "Arrived",
  INSURGERY = "In surgery",
  COMPLETED = "Completed",
  CANCELLED = "Cancelled",
  DIDNOTATTEND = "Did not attend",
}
