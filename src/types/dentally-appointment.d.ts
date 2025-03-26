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

interface CreateAppointment {
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

interface ListAppointment {
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

interface AvailableAppointments {
  startTime: Date;
  finishTime: Date;
  practitionerIds: number[];
  duration?: number;
  page?: number;
  perPage?: number;
}

interface AppointmentReasonDetails {
  colour: string;
  deleted: boolean;
  exam: boolean;
  hygiene: boolean;
  position: number;
  reason?: string;
}
