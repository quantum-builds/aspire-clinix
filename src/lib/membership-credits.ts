import { Prisma } from "@prisma/client";
import { isBreathworkTreatment } from "@/lib/treatment-session";

/**
 * Gives back the plan credit used by a plan-booked treatment session
 * (Breathwork, ...). Mirrors the increment in POST /api/sessions: Breathwork
 * uses usedBreathwork, everything else one usedTreatments.
 *
 * Claims the MEMBERSHIP WellnessAppointment row by deleting it, like the
 * Dentally webhook does, so a credit is never restored twice. Returns true
 * when a credit was restored. Must run inside the caller's transaction.
 */
export async function restoreSessionCredit(
  tx: Prisma.TransactionClient,
  session: { id: string; treatment: { name: string } },
): Promise<boolean> {
  const booking = await tx.wellnessAppointment.findUnique({
    where: { appointmentId: session.id },
    include: { membership: true },
  });

  if (
    !booking ||
    booking.appointmentType !== "MEMBERSHIP_APPPOINTMENT" ||
    !booking.membership
  ) {
    return false;
  }

  if (booking.membership.status !== "ACTIVE") {
    console.log(`Session ${session.id}: membership not active, credit not restored`);
    return false;
  }

  const claim = await tx.wellnessAppointment.deleteMany({
    where: { id: booking.id },
  });

  if (claim.count !== 1) {
    return false;
  }

  const isBreathwork = isBreathworkTreatment(session.treatment.name);
  const counter = isBreathwork ? "usedBreathwork" : "usedTreatments";

  const updated = await tx.patientMembership.updateMany({
    where: isBreathwork
      ? { id: booking.membership.id, usedBreathwork: { gte: 1 } }
      : { id: booking.membership.id, usedTreatments: { gte: 1 } },
    data: isBreathwork
      ? { usedBreathwork: { decrement: 1 } }
      : { usedTreatments: { decrement: 1 } },
  });

  if (updated.count !== 1) {
    // Rolls back the claim too.
    throw new Error(`Unable to restore ${counter} for session ${session.id}`);
  }

  console.log(`Session ${session.id}: restored 1 ${counter}`);
  return true;
}
