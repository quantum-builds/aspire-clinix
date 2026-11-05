import { createResponse } from "@/utils/createResponse";
import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";
import { Prisma, PrismaClient } from "@prisma/client";
import {
  createAppointment,
  editAppointment,
} from "@/dentallyHelpers/appointment";
import { getAvailability } from "@/dentallyHelpers/availability";
import {
  logDentallyError,
  PATIENT_OVERLAP_MESSAGE,
  patientHasOverlap,
} from "@/dentallyHelpers/patientOverlap";
import {
  resolveWellnessTreatment,
  WellnessTreatmentError,
} from "@/lib/wellness-booking";
import { AppointmentState } from "@/types/appointment";
import {
  getTreatmentPlanCost,
  HYPERBARIC_TREATMENT_ID,
} from "@/lib/plan-treatment-cost";
import {
  evaluatePlanEligibility,
  syncMembershipPeriod,
} from "@/lib/plan-booking";
import { notifyWellnessBooking } from "@/notifications/wellnessNotifications";

const prisma = new PrismaClient();

const AVAILABILITY_PADDING_MS = 12 * 60 * 60 * 1000;
const MIN_AVAILABILITY_RANGE_MS = 24 * 60 * 60 * 1000;

type DentallyAvailabilityEntry = {
  startTime?: string | null;
  finishTime?: string | null;
};

function slotIsAvailable(
  entries: DentallyAvailabilityEntry[],
  startTime: string,
  finishTime: string,
): boolean {
  const slotStart = new Date(startTime).getTime();
  const slotFinish = new Date(finishTime).getTime();

  return entries.some((entry) => {
    const entryStart = new Date(entry.startTime ?? "").getTime();
    const entryFinish = new Date(entry.finishTime ?? "").getTime();

    return (
      Number.isFinite(entryStart) &&
      Number.isFinite(entryFinish) &&
      entryStart <= slotStart &&
      entryFinish >= slotFinish
    );
  });
}

export async function POST(req: NextRequest) {
  try {
    const token = await getToken({ req });

    if (!token) {
      return NextResponse.json(createResponse(false, "Unauthorized", null), {
        status: 401,
      });
    }

    const body = await req.json();
    // practitionerId and finishTime are worked out from the treatment below;
    // any values sent by the browser are ignored.
    const { treatmentId, startTime, reason } = body;

    // console.log("HIT THE BOOK WITH PLAN API");

    // console.log("Received booking request with body:", body);

    if (!treatmentId || !startTime) {
      return NextResponse.json(
        createResponse(false, "Missing required booking details", null),
        { status: 400 },
      );
    }

    if (Number.isNaN(new Date(startTime).getTime())) {
      return NextResponse.json(
        createResponse(false, "Invalid appointment date/time", null),
        { status: 400 },
      );
    }

    let resolved: Awaited<ReturnType<typeof resolveWellnessTreatment>>;

    try {
      resolved = await resolveWellnessTreatment(treatmentId);
    } catch (error) {
      if (error instanceof WellnessTreatmentError) {
        return NextResponse.json(createResponse(false, error.message, null), {
          status: error.status,
        });
      }
      throw error;
    }

    const { practitionerId } = resolved;
    const finishTime = new Date(
      new Date(startTime).getTime() + resolved.duration * 60 * 1000,
    ).toISOString();

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
    // console.log(
      // "BEFORE FETCHING MEMBERSHIP AND ADD CHECK MEMERSHIP IS ACTIVE OR NOT",
    // );
    const membership = await prisma.patientMembership.findFirst({
      where: { patientId: patient.id, status: "ACTIVE" },
      include: { plan: true },
    });

    if (!membership) {
      return NextResponse.json(
        createResponse(true, "No active plan", { status: "NO_ACTIVE_PLAN" }),
        { status: 200 },
      );
    }

    const synced = await syncMembershipPeriod(prisma, membership);
    const plan = synced.plan;
    const isHyperbaric = Number(treatmentId) === HYPERBARIC_TREATMENT_ID;
    const cost = getTreatmentPlanCost(Number(treatmentId));

    // console.log("BEFORE ELIGIBILITY CHECK ");

    const eligibility = evaluatePlanEligibility(
      synced,
      plan,
      Number(treatmentId),
    );

    if (eligibility !== "OK") {
      return NextResponse.json(
        createResponse(true, "Not eligible for plan booking", {
          status: eligibility,
        }),
        { status: 200 },
      );
    }

    const now = Date.now();

    if (new Date(startTime).getTime() <= now) {
      return NextResponse.json(
        createResponse(false, "This slot is in the past", null),
        { status: 400 },
      );
    }

    // Dentally rejects availability queries that start in the past, and
    // expects a range of at least 24 hours.
    const windowStart = new Date(
      Math.max(now, new Date(startTime).getTime() - AVAILABILITY_PADDING_MS),
    );
    const windowEnd = new Date(
      Math.max(
        new Date(finishTime).getTime() + AVAILABILITY_PADDING_MS,
        windowStart.getTime() + MIN_AVAILABILITY_RANGE_MS,
      ),
    );

    const durationMinutes = resolved.duration;

    let availabilityResponse: Awaited<ReturnType<typeof getAvailability>>;

    try {
      availabilityResponse = await getAvailability({
        practitionerId: Number(practitionerId),
        startTime: windowStart.toISOString(),
        finishTime: windowEnd.toISOString(),
        duration: durationMinutes,
      });
    } catch (error) {
      logDentallyError("availability", error);
      throw error;
    }

    // console.log("Availability response:", availabilityResponse);

    const slotFree =
      availabilityResponse.isError ||
      slotIsAvailable(
        (availabilityResponse.response.availability ||
          []) as DentallyAvailabilityEntry[],
        startTime,
        finishTime,
      );

    if (!slotFree) {
      return NextResponse.json(
        createResponse(
          true,
          "This slot is no longer available. Please select another time.",
          { status: "SLOT_TAKEN" },
        ),
        { status: 200 },
      );
    }

    const hasOverlap = await patientHasOverlap(dentallyId, startTime, finishTime);

    if (hasOverlap) {
      return NextResponse.json(
        createResponse(true, PATIENT_OVERLAP_MESSAGE, {
          status: "PATIENT_OVERLAP",
        }),
        { status: 200 },
      );
    }

    // The patient comes from the session, never from the request body.
    const appointmentData = {
      startTime: new Date(startTime),
      finishTime: new Date(finishTime),
      practitionerId: Number(practitionerId),
      patientId: dentallyId,
      reason: reason || "Wellness Appointment",
    };

    // console.log(
      // "Creating Dentally appointment with data (Book with plan):",
      // appointmentData,
    // );

    let result: Awaited<ReturnType<typeof createAppointment>>;

    try {
      result = await createAppointment(appointmentData);
    } catch (error) {
      logDentallyError("appointment creation", error);
      throw error;
    }

    // console.log(
      // "Dentally appointment creation result:(Book with plan)",
      // result,
    // );

    if (result.isError) {
      // console.error(
        // "Failed to create Dentally appointment (Book with plan):",
        // result.response,
      // );

      return NextResponse.json(
        createResponse(
          false,
          "Failed to create appointment. Please try again.",
          null,
        ),
        { status: 500 },
      );
    }

    const appointmentId =
      result.response?.id || result.response?.appointment?.id;

    let updatedMembership;

    try {
      updatedMembership = await prisma.$transaction(async (tx) => {
        const guardWhere: Prisma.PatientMembershipWhereInput = {
          id: membership.id,
        };

        if (plan.treatmentLimit !== null) {
          guardWhere.usedTreatments = { lte: plan.treatmentLimit - cost };
        }

        if (isHyperbaric && plan.hyperbaricLimit !== null) {
          guardWhere.usedHyperbaric = { lte: plan.hyperbaricLimit - 1 };
        }

        const updateResult = await tx.patientMembership.updateMany({
          where: guardWhere,
          data: isHyperbaric
            ? {
                usedTreatments: { increment: cost },
                usedHyperbaric: { increment: 1 },
              }
            : { usedTreatments: { increment: cost } },
        });

        if (updateResult.count === 0) {
          throw new Error("LIMIT_GUARD_FAILED");
        }

        await tx.wellnessAppointment.create({
          data: {
            membershipId: membership.id,
            appointmentId: String(appointmentId),
            treatmentId: String(treatmentId),
            appointmentType: "MEMBERSHIP_APPPOINTMENT",
          },
        });

        return tx.patientMembership.findUnique({
          where: { id: membership.id },
          include: { plan: true },
        });
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);

      if (message === "LIMIT_GUARD_FAILED") {
        try {
          await editAppointment(String(appointmentId), {
            state: AppointmentState.CANCELLED,
          });
        } catch (cancelError) {
          // console.error(
            // "Failed to cancel Dentally appointment after balance guard failure:",
            // cancelError,
          // );
        }

        const fresh = await prisma.patientMembership.findFirst({
          where: { id: membership.id },
          include: { plan: true },
        });

        const reason = fresh
          ? evaluatePlanEligibility(fresh, fresh.plan, Number(treatmentId))
          : "PLAN_LIMIT_REACHED";

        return NextResponse.json(
          createResponse(true, "Not enough plan balance", {
            status: reason === "OK" ? "PLAN_LIMIT_REACHED" : reason,
          }),
          { status: 200 },
        );
      }

      throw error;
    }

    await notifyWellnessBooking({
      treatmentId,
      patientDentallyId: dentallyId,
      startTime,
    });

    return NextResponse.json(
      createResponse(true, "Appointment booked successfully", {
        status: "OK",
        appointmentId,
        remainingTreatments:
          plan.treatmentLimit === null
            ? null
            : Math.max(
                0,
                plan.treatmentLimit - (updatedMembership?.usedTreatments ?? 0),
              ),
        remainingHyperbaric:
          plan.hyperbaricLimit === null
            ? null
            : Math.max(
                0,
                plan.hyperbaricLimit - (updatedMembership?.usedHyperbaric ?? 0),
              ),
      }),
      { status: 200 },
    );
  } catch (error) {
    logDentallyError("book-with-plan", error);
    // console.error("Plan booking error:", error);

    return NextResponse.json(
      createResponse(
        false,
        error instanceof Error ? error.message : "Plan booking failed",
        null,
      ),
      { status: 500 },
    );
  }
}
