import prisma from "@/lib/db";
import { syncMembershipPeriod } from "@/lib/plan-booking";
import {
  findTreatmentSlot,
  isBreathworkTreatment,
  reserveTreatmentSlot,
  TreatmentSlotException,
} from "@/lib/treatment-session";
import { createResponse } from "@/utils/createResponse";
import { stripe } from "@/lib/stripe/client";
import { getOrCreateStripeCustomer } from "@/lib/stripe/customer";
import { isValidCuid } from "@/utils/typeValidUtils";
import { Prisma } from "@prisma/client";
import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";

const SLOT_ERROR_RESPONSES: Record<string, { message: string; status: number }> = {
  TREATMENT_NOT_FOUND: { message: "Treatment not found.", status: 404 },
  SLOT_NOT_FOUND: { message: "Selected slot does not exist.", status: 400 },
  SLOT_IN_PAST: { message: "This slot is in the past.", status: 400 },
  SLOT_FULL: { message: "This slot is fully booked.", status: 409 },
  SLOT_CONFLICT: {
    message: "This slot was just updated. Please try again.",
    status: 409,
  },
};

export async function POST(req: NextRequest) {
  try {
    const token = await getToken({ req });

    if (!token) {
      return NextResponse.json(createResponse(false, "Unauthorized", null), {
        status: 401,
      });
    }

    const dentallyId = Number(token.id);

    if (Number.isNaN(dentallyId)) {
      return NextResponse.json(
        createResponse(false, "Invalid patient session", null),
        { status: 401 },
      );
    }

    const patient = await prisma.patient.findUnique({
      where: { dentallyId },
    });

    if (!patient) {
      return NextResponse.json(
        createResponse(false, "Patient not found", null),
        { status: 404 },
      );
    }

    const { treatmentId, date, startTime, payWithStripe } = await req.json();

    if (
      typeof treatmentId !== "string" ||
      !isValidCuid(treatmentId) ||
      typeof date !== "string" ||
      !/^\d{4}-\d{2}-\d{2}$/.test(date) ||
      typeof startTime !== "string" ||
      !/^([01]\d|2[0-3]):[0-5]\d$/.test(startTime)
    ) {
      return NextResponse.json(
        createResponse(false, "Missing or invalid booking details", null),
        { status: 400 },
      );
    }

    const treatment = await prisma.treatment.findUnique({
      where: { id: treatmentId },
    });

    if (!treatment || !treatment.isActive) {
      return NextResponse.json(
        createResponse(false, "Treatment not found.", null),
        { status: 404 },
      );
    }

    const found = findTreatmentSlot(treatment.availabilities, date, startTime);

    if ("error" in found) {
      const { message, status } = SLOT_ERROR_RESPONSES[found.error];
      return NextResponse.json(createResponse(false, message, null), {
        status,
      });
    }

    const existingSession = await prisma.session.findFirst({
      where: { patientId: dentallyId, treatmentId, startTime: found.start },
    });

    if (existingSession) {
      return NextResponse.json(
        createResponse(false, "You already booked this slot.", null),
        { status: 409 },
      );
    }

    const membership = await prisma.patientMembership.findFirst({
      where: { patientId: patient.id, status: "ACTIVE" },
      include: { plan: true },
    });

    if (membership && !payWithStripe) {
      const synced = await syncMembershipPeriod(prisma, membership);
      const plan = synced.plan;
      const isBreathwork = isBreathworkTreatment(treatment.name);

      // Breathwork uses its own allowance and does not count towards
      // usedTreatments.
      if (
        !isBreathwork &&
        plan.treatmentLimit !== null &&
        synced.usedTreatments + 1 > plan.treatmentLimit
      ) {
        return NextResponse.json(
          createResponse(true, "Not eligible for plan booking", {
            status: "PLAN_LIMIT_REACHED",
          }),
          { status: 200 },
        );
      }

      if (isBreathwork && synced.usedBreathwork + 1 > plan.breathworkLimit) {
        return NextResponse.json(
          createResponse(true, "Not eligible for plan booking", {
            status: "BREATHWORK_LIMIT_REACHED",
          }),
          { status: 200 },
        );
      }

      try {
        const { session, updatedMembership } = await prisma.$transaction(
          async (tx) => {
            const { treatment: reservedTreatment, start, end } =
              await reserveTreatmentSlot(
              tx,
              treatmentId,
              date,
              startTime,
            );

            const guardWhere: Prisma.PatientMembershipWhereInput = {
              id: synced.id,
            };

            if (isBreathwork) {
              guardWhere.usedBreathwork = { lte: plan.breathworkLimit - 1 };
            } else if (plan.treatmentLimit !== null) {
              guardWhere.usedTreatments = { lte: plan.treatmentLimit - 1 };
            }

            const updateResult = await tx.patientMembership.updateMany({
              where: guardWhere,
              data: isBreathwork
                ? { usedBreathwork: { increment: 1 } }
                : { usedTreatments: { increment: 1 } },
            });

            if (updateResult.count === 0) {
              throw new Error("LIMIT_GUARD_FAILED");
            }

            const duplicate = await tx.session.findFirst({
              where: { patientId: dentallyId, treatmentId, startTime: start },
            });

            if (duplicate) {
              throw new Error("DUPLICATE_SESSION");
            }

            const session = await tx.session.create({
              data: {
                patientId: dentallyId,
                patientName: patient.name,
                practitionerId: reservedTreatment.practitionerId
                  ? Number(reservedTreatment.practitionerId)
                  : null,
                practitionerName: reservedTreatment.practitionerName,
                treatmentId,
                startTime: start,
                endTime: end,
              },
            });

            await tx.membershipAppointment.create({
              data: {
                membershipId: synced.id,
                appointmentId: session.id,
              },
            });

            const updatedMembership = await tx.patientMembership.findUnique({
              where: { id: synced.id },
            });

            return { session, updatedMembership };
          },
        );

        return NextResponse.json(
          createResponse(true, "Session booked successfully", {
            status: "BOOKED",
            session,
            remainingTreatments:
              plan.treatmentLimit === null
                ? null
                : Math.max(
                    0,
                    plan.treatmentLimit -
                      (updatedMembership?.usedTreatments ?? 0),
                  ),
            remainingBreathwork: Math.max(
              0,
              plan.breathworkLimit - (updatedMembership?.usedBreathwork ?? 0),
            ),
          }),
          { status: 201 },
        );
      } catch (error) {
        if (error instanceof TreatmentSlotException) {
          const { message, status } = SLOT_ERROR_RESPONSES[error.code];
          return NextResponse.json(createResponse(false, message, null), {
            status,
          });
        }

        const message = error instanceof Error ? error.message : String(error);

        if (message === "LIMIT_GUARD_FAILED") {
          return NextResponse.json(
            createResponse(true, "Not enough plan balance", {
              status: isBreathwork
                ? "BREATHWORK_LIMIT_REACHED"
                : "PLAN_LIMIT_REACHED",
            }),
            { status: 200 },
          );
        }

        if (message === "DUPLICATE_SESSION") {
          return NextResponse.json(
            createResponse(false, "You already booked this slot.", null),
            { status: 409 },
          );
        }

        throw error;
      }
    }

    const origin =
      process.env.NEXT_PUBLIC_APP_URL || req.headers.get("origin") || "";

    const customer = await getOrCreateStripeCustomer(patient);

    const checkoutSession = await stripe.checkout.sessions.create({
      customer,

      line_items: [
        {
          price: treatment.stripePriceId,
          quantity: 1,
        },
      ],

      mode: "payment",

      metadata: {
        payment_for: "treatment_session",
        treatment_id: treatmentId,
        patient_id: String(dentallyId),
        date,
        start_time: startTime,
      },

      success_url: `${origin}/patient/appointments/upcoming?session_id={CHECKOUT_SESSION_ID}`,

      cancel_url: `${origin}/patient/plan-selection/wellness-treatments/${treatmentId}/slots`,
    });

    return NextResponse.json(
      createResponse(true, "Checkout session created", {
        status: "CHECKOUT",
        checkoutUrl: checkoutSession.url,
        sessionId: checkoutSession.id,
      }),
      { status: 200 },
    );
  } catch (error) {
    console.error("Session booking error:", error);

    return NextResponse.json(
      createResponse(
        false,
        error instanceof Error ? error.message : "Session booking failed",
        null,
      ),
      { status: 500 },
    );
  }
}
