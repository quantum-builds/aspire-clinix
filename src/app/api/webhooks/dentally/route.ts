
import crypto from "crypto";
import { Prisma } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import {
  getTreatmentPlanCost,
  HYPERBARIC_TREATMENT_ID,
} from "@/lib/plan-treatment-cost";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const WEBHOOK_SECRET = process.env.DENTALLY_WEBHOOK_SECRET;

type Appointment = {
  id?: number | string;
  patient_id?: number | string | null;
  state?: string;
};

type WebhookPayload = {
  event?: string;
  data?: Appointment | { appointment?: Appointment };
  appointment?: Appointment;
};

// Verify webhook signature
function verifySignature(
  rawBody: string,
  signature: string | null,
): boolean {
  if (!WEBHOOK_SECRET || !signature) return false;

  const received = signature.trim();

  if (!/^[a-fA-F0-9]{64}$/.test(received)) {
    return false;
  }

  const expected = crypto
    .createHmac("sha256", WEBHOOK_SECRET)
    .update(rawBody, "utf8")
    .digest();

  const supplied = Buffer.from(received, "hex");

  return (
    supplied.length === expected.length &&
    crypto.timingSafeEqual(supplied, expected)
  );
}

// Extract appointment from webhook payload
function getAppointment(
  payload: WebhookPayload,
): Appointment | null {
  if (
    payload.appointment &&
    typeof payload.appointment === "object"
  ) {
    return payload.appointment;
  }

  if (!payload.data || typeof payload.data !== "object") {
    return null;
  }

  if (
    "appointment" in payload.data &&
    payload.data.appointment
  ) {
    return payload.data.appointment;
  }

  return payload.data as Appointment;
}

// Convert treatment/patient IDs to valid numbers
function parsePositiveInteger(
  value: number | string | null | undefined,
): number | null {
  if (value === null || value === undefined || value === "") {
    return null;
  }

  const parsed = Number(value);

  return Number.isSafeInteger(parsed) && parsed > 0
    ? parsed
    : null;
}

// Calculate membership usage using treatmentId
// from WellnessAppointment table
function getUsageCost(
  treatmentId: string | null,
): { treatments: number; hyperbaric: number } | null {
  const parsedTreatmentId = parsePositiveInteger(treatmentId);

  if (parsedTreatmentId === null) {
    return null;
  }

  // Hyperbaric Oxygen Chamber
  if (parsedTreatmentId === HYPERBARIC_TREATMENT_ID) {
    return {
      treatments: 1,
      hyperbaric: 1,
    };
  }

  // Other treatments, including Contrast Session
  const cost = getTreatmentPlanCost(parsedTreatmentId);

  if (!Number.isSafeInteger(cost) || cost <= 0) {
    return null;
  }

  return {
    treatments: cost,
    hyperbaric: 0,
  };
}

// Restore membership usage on cancellation/deletion
async function restoreMembershipUsage(
  appointment: Appointment,
): Promise<void> {
  const appointmentId =
    appointment.id === null || appointment.id === undefined
      ? ""
      : String(appointment.id).trim();

  const patientDentallyId = parsePositiveInteger(
    appointment.patient_id,
  );

  if (!appointmentId) {
    console.warn(
      "Dentally cancellation skipped: missing appointment ID",
    );
    return;
  }

  await prisma.$transaction(
    async (tx) => {
      // Step 1: Find WellnessAppointment
      const booking =
        await tx.wellnessAppointment.findUnique({
          where: {
            appointmentId,
          },
          include: {
            membership: {
              include: {
                patient: true,
              },
            },
          },
        });

      if (!booking) {
        console.log(
          `Dentally appointment ${appointmentId}: no membership booking found`,
        );
        return;
      }

      // Single (paid) bookings did not use plan balance, so nothing to restore.
      if (booking.appointmentType !== "MEMBERSHIP_APPPOINTMENT" || !booking.membership) {
        console.log(
          `Dentally appointment ${appointmentId}: not a membership booking`,
        );
        return;
      }

      const membership = booking.membership;

      // Step 2: Validate patient
      // Deleted events may not include patient_id.
      if (
        patientDentallyId !== null &&
        membership.patient.dentallyId !== patientDentallyId
      ) {
        console.warn(
          `Dentally appointment ${appointmentId}: patient mismatch`,
        );
        return;
      }

      // Step 3: Check active membership
      if (membership.status !== "ACTIVE") {
        console.log(
          `Dentally appointment ${appointmentId}: membership not active`,
        );
        return;
      }

      // Step 4: Get treatment ID from WellnessAppointment
      const treatmentId = booking.treatmentId;

      if (!treatmentId) {
        console.warn(
          `Dentally appointment ${appointmentId}: treatmentId missing in WellnessAppointment`,
        );
        return;
      }

      // Step 5: Calculate treatment usage
      const usage = getUsageCost(treatmentId);

      if (!usage) {
        console.warn(
          `Dentally appointment ${appointmentId}: unknown treatment cost for treatmentId ${treatmentId}`,
        );
        return;
      }

      console.log(
        `Dentally appointment ${appointmentId}: treatmentId=${treatmentId}`,
      );

      // Step 6: Validate membership counters
      if (
        membership.usedTreatments < usage.treatments ||
        membership.usedHyperbaric < usage.hyperbaric
      ) {
        console.error(
          `Dentally appointment ${appointmentId}: inconsistent membership counters`,
        );

        throw new Error(
          "Membership counters do not match cancellation usage",
        );
      }

      // Step 7: Claim booking to prevent duplicate restoration
      const claim =
        await tx.wellnessAppointment.deleteMany({
          where: {
            id: booking.id,
          },
        });

      if (claim.count !== 1) {
        console.log(
          `Dentally appointment ${appointmentId}: already processed`,
        );
        return;
      }

      // Step 8: Restore membership usage
      const updated =
        await tx.patientMembership.updateMany({
          where: {
            id: membership.id,
            status: "ACTIVE",
            usedTreatments: {
              gte: usage.treatments,
            },
            ...(usage.hyperbaric > 0
              ? {
                  usedHyperbaric: {
                    gte: usage.hyperbaric,
                  },
                }
              : {}),
          },
          data: {
            usedTreatments: {
              decrement: usage.treatments,
            },
            ...(usage.hyperbaric > 0
              ? {
                  usedHyperbaric: {
                    decrement: usage.hyperbaric,
                  },
                }
              : {}),
          },
        });

      if (updated.count !== 1) {
        // Roll back booking deletion too
        throw new Error(
          "Unable to restore membership counters atomically",
        );
      }

      console.log(
        `Dentally appointment ${appointmentId}: restored ` +
          `${usage.treatments} treatment(s)` +
          (usage.hyperbaric
            ? ` and ${usage.hyperbaric} hyperbaric use(s)`
            : ""),
      );
    },
    {
      isolationLevel:
        Prisma.TransactionIsolationLevel.Serializable,
      maxWait: 5000,
      timeout: 10000,
    },
  );
}

// Dentally webhook endpoint
export async function POST(request: NextRequest) {
  const rawBody = await request.text();

  const signature = request.headers.get(
    "X-Dentally-Signature",
  );

  // Check webhook secret
  if (!WEBHOOK_SECRET) {
    console.error(
      "DENTALLY_WEBHOOK_SECRET is not configured",
    );

    return NextResponse.json(
      { error: "Webhook not configured" },
      { status: 503 },
    );
  }

  // Verify signature
  if (!verifySignature(rawBody, signature)) {
    return NextResponse.json(
      { error: "Invalid signature" },
      { status: 401 },
    );
  }

  // Parse webhook payload
  let payload: WebhookPayload;

  try {
    payload = JSON.parse(rawBody) as WebhookPayload;
  } catch {
    return NextResponse.json(
      { error: "Invalid JSON" },
      { status: 400 },
    );
  }

  const event = payload.event;
  const appointment = getAppointment(payload);

  // Detect cancellation or deletion
  const isCancellation =
    (event === "appointment.updated" &&
      appointment?.state === "Cancelled") ||
    event === "appointment.deleted";

  // Skip other events
  if (!isCancellation) {
    console.log(
      `Dentally webhook skipped: ${event ?? "unknown"}, ` +
        `state=${appointment?.state ?? "unknown"}`,
    );

    return NextResponse.json({
      received: true,
      skipped: true,
    });
  }

  if (!appointment?.id) {
    console.warn(
      `Dentally ${event}: appointment ID missing`,
    );

    return NextResponse.json(
      { error: "Missing appointment ID" },
      { status: 400 },
    );
  }

  // Restore membership usage
  try {
    await restoreMembershipUsage(appointment);

    return NextResponse.json(
      {
        received: true,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error(
      "Dentally cancellation processing failed:",
      error,
    );

    return NextResponse.json(
      { error: "Webhook processing failed" },
      { status: 500 },
    );
  }
}
