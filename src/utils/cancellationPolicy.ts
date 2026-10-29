import { AppointmentState } from "@/types/appointment";

/** Patients may cancel for this many hours after booking. */
export const PATIENT_CANCEL_WINDOW_HOURS = 24;

export const LATE_CANCEL_MESSAGE =
  "Appointments can only be cancelled within 24 hours of booking. Please contact the clinic on 020 8081 9958.";

const CANCELLABLE_STATES: string[] = [
  AppointmentState.PENDING,
  AppointmentState.CONFIRMED,
];

/**
 * When the patient's cancel window closes: 24 h after booking, or the start
 * time if that comes first. Null when either time is missing or invalid.
 */
export function cancelDeadline(
  createdAt: string | Date | null | undefined,
  startTime: string | Date | null | undefined,
): Date | null {
  if (!createdAt || !startTime) return null;

  const booked = new Date(createdAt).getTime();
  const start = new Date(startTime).getTime();

  if (Number.isNaN(booked) || Number.isNaN(start)) return null;

  return new Date(
    Math.min(booked + PATIENT_CANCEL_WINDOW_HOURS * 60 * 60 * 1000, start),
  );
}

/**
 * Whether a patient may cancel this appointment from their dashboard: it is
 * still Pending/Confirmed, was booked less than 24 h ago, and has not started.
 */
export function canPatientCancel(
  appointment: {
    state: string;
    startTime: string | Date;
    createdAt?: string | Date | null;
  },
  now: Date = new Date(),
): boolean {
  const deadline = cancelDeadline(appointment.createdAt, appointment.startTime);

  return (
    CANCELLABLE_STATES.includes(appointment.state) &&
    deadline !== null &&
    now.getTime() < deadline.getTime()
  );
}
