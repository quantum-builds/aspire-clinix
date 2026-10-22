import { Prisma, Session, Treatment } from "@prisma/client";
import { AppointmentState, TAppointment } from "@/types/appointment";
import { fromZonedTime } from "date-fns-tz";
import { TIMEZONE } from "@/utils/slotSelectionUtils";
import { TAvailability } from "@/types/treatment";

export type TreatmentSlotError =
  | "TREATMENT_NOT_FOUND"
  | "SLOT_NOT_FOUND"
  | "SLOT_IN_PAST"
  | "SLOT_FULL"
  | "SLOT_CONFLICT";

export class TreatmentSlotException extends Error {
  constructor(public code: TreatmentSlotError) {
    super(code);
  }
}

export function isBreathworkTreatment(name: string): boolean {
  return name.toLowerCase().includes("breathwork");
}

export function findTreatmentSlot(
  availabilities: Prisma.JsonValue | null,
  date: string,
  startTime: string,
):
  | { index: number; slot: TAvailability; start: Date; end: Date }
  | { error: TreatmentSlotError } {
  const slots = (Array.isArray(availabilities)
    ? availabilities
    : []) as unknown as TAvailability[];


  const index = slots.findIndex(
    (slot) => slot.date === date && slot.startTime === startTime,
  );

  if (index === -1) {
    return { error: "SLOT_NOT_FOUND" };
  }

  const slot = slots[index];
  const start = fromZonedTime(`${date}T${slot.startTime}:00`, TIMEZONE);
  const end = fromZonedTime(`${date}T${slot.finishTime}:00`, TIMEZONE);

  if (start.getTime() <= Date.now()) {
    return { error: "SLOT_IN_PAST" };
  }

  if (slot.remainingLimit <= 0) {
    return { error: "SLOT_FULL" };
  }

  return { index, slot, start, end };
}

export async function reserveTreatmentSlot(
  tx: Prisma.TransactionClient,
  treatmentId: string,
  date: string,
  startTime: string,
) {
  const treatment = await tx.treatment.findUnique({
    where: { id: treatmentId },
  });

  if (!treatment || !treatment.isActive) {
    throw new TreatmentSlotException("TREATMENT_NOT_FOUND");
  }

  const found = findTreatmentSlot(treatment.availabilities, date, startTime);

  if ("error" in found) {
    throw new TreatmentSlotException(found.error);
  }

  const availabilities = (
    treatment.availabilities as unknown as TAvailability[]
  ).map((slot, index) =>
    index === found.index
      ? { ...slot, remainingLimit: slot.remainingLimit - 1 }
      : slot,
  );

  const updateResult = await tx.treatment.updateMany({
    where: { id: treatment.id, updatedAt: treatment.updatedAt },
    data: { availabilities },
  });

  if (updateResult.count === 0) {
    throw new TreatmentSlotException("SLOT_CONFLICT");
  }

  return { treatment, start: found.start, end: found.end };
}

/**
 * Shapes a booked Session like a Dentally appointment so it can be listed and
 * opened through the existing appointment cards and report pages.
 */
export function sessionToAppointment(
  session: Session & { treatment: Treatment },
): TAppointment {
  return {
    id: session.id,
    appointmentCancellationReasonId: null,
    arrivedAt: null,
    bookedViaApi: false,
    cancelledAt: null,
    completedAt: null,
    confirmedAt: session.createdAt.toISOString(),
    createdAt: session.createdAt.toISOString(),
    didNotAttendAt: null,
    duration: Math.round(
      (session.endTime.getTime() - session.startTime.getTime()) / 60000,
    ),
    finishTime: session.endTime.toISOString(),
    importId: null,
    inSurgeryAt: null,
    metadata: {},
    notes: null,
    patientId: session.patientId,
    patientImageUrl: "",
    patientName: session.patientName,
    paymentPlanId: null,
    pendingAt: null,
    practitionerId: session.practitionerId ?? 0,
    reason: session.treatment.name,
    roomId: null,
    startTime: session.startTime.toISOString(),
    state: AppointmentState.CONFIRMED,
    treatmentDescription: session.treatment.description,
    updatedAt: session.updatedAt.toISOString(),
    userId: 0,
    practitionerSiteId: "",
    practitionerName: session.practitionerName ?? "",
    uuid: session.id,
  };
}
