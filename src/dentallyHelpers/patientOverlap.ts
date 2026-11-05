import axios from "axios";
import { AppointmentState } from "@/types/appointment";
import { listAppointment } from "./appointment";

const DAY_MS = 24 * 60 * 60 * 1000;

const INACTIVE_APPOINTMENT_STATES: string[] = [
  AppointmentState.CANCELLED,
  AppointmentState.DIDNOTATTEND,
];

export const PATIENT_OVERLAP_MESSAGE =
  "You already have an appointment at this time. Please choose another time.";

type DentallyAppointmentSummary = {
  startTime?: string | null;
  finishTime?: string | null;
  state?: string | null;
};

export function logDentallyError(context: string, error: unknown) {
  if (axios.isAxiosError(error)) {
    console.error(`[Dentally ${context}] request failed`, {
      status: error.response?.status,
      statusText: error.response?.statusText,
      responseData: error.response?.data,
      method: error.config?.method,
      url: error.config?.url,
      requestData: error.config?.data,
      responseHeaders: error.response?.headers,
      message: error.message,
    });
    return;
  }

  console.error(`[Dentally ${context}] unexpected error`, error);
}

/**
 * Dentally rejects (422) an appointment that overlaps another one for the
 * same patient. The availability check only covers the practitioner, so
 * check the patient's own diary before creating. Returns null when the
 * lookup fails, so a Dentally hiccup does not block the booking.
 */
export async function patientHasOverlap(
  patientId: number,
  startTime: string,
  finishTime: string,
): Promise<boolean | null> {
  const slotStart = new Date(startTime).getTime();
  const slotFinish = new Date(finishTime).getTime();

  try {
    // Dates are whole days in Dentally's site timezone, so widen by a day
    // each side and compare exact times below.
    const result = await listAppointment({
      patientId: String(patientId),
      after: new Date(slotStart - DAY_MS),
      before: new Date(slotFinish + DAY_MS),
      perPage: 100,
    });

    if (result.isError) return null;

    const appointments = (result.response.appointments ??
      []) as DentallyAppointmentSummary[];

    return appointments.some((appointment) => {
      if (INACTIVE_APPOINTMENT_STATES.includes(appointment.state ?? "")) {
        return false;
      }

      const start = new Date(appointment.startTime ?? "").getTime();
      const finish = new Date(appointment.finishTime ?? "").getTime();

      return (
        Number.isFinite(start) &&
        Number.isFinite(finish) &&
        start < slotFinish &&
        finish > slotStart
      );
    });
  } catch (error) {
    logDentallyError("patient appointments", error);
    return null;
  }
}
