import { stripe } from "@/utils/stripe";
import { createResponse } from "@/utils/createResponse";
import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import { getOrCreateStripeCustomer } from "@/lib/stripe/customer";
import {
  PATIENT_OVERLAP_MESSAGE,
  patientHasOverlap,
} from "@/dentallyHelpers/patientOverlap";
import {
  resolveWellnessTreatment,
  WellnessTreatmentError,
} from "@/lib/wellness-booking";

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

    // The patient always comes from the session, never from the request
    // body, so nobody can book or pay under another patient's id.
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

    console.log("[PAID-BOOKING checkout] request", {
      dentallyId,
      treatmentId,
      startTime,
      patientFound: Boolean(patient),
    });

    if (!patient) {
      return NextResponse.json(
        createResponse(false, "Patient not found", null),
        { status: 404 },
      );
    }

    if (!treatmentId || !startTime) {
      return NextResponse.json(
        createResponse(false, "Missing required booking details", null),
        { status: 400 },
      );
    }

    const parsedStartTime = new Date(startTime);

    if (Number.isNaN(parsedStartTime.getTime())) {
      return NextResponse.json(
        createResponse(false, "Invalid appointment date/time", null),
        { status: 400 },
      );
    }

    if (parsedStartTime.getTime() <= Date.now()) {
      return NextResponse.json(
        createResponse(false, "This slot is in the past", null),
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

    const { practitionerId, duration } = resolved;
    const parsedFinishTime = new Date(
      parsedStartTime.getTime() + duration * 60 * 1000,
    );

    // Dentally rejects an appointment that overlaps another of the patient's,
    // so check before taking payment.
    const hasOverlap = await patientHasOverlap(
      dentallyId,
      parsedStartTime.toISOString(),
      parsedFinishTime.toISOString(),
    );

    console.log(
      "[PAID-BOOKING checkout] patient overlap",
      hasOverlap === null ? "null (lookup failed)" : hasOverlap,
    );

    if (hasOverlap) {
      return NextResponse.json(
        createResponse(false, PATIENT_OVERLAP_MESSAGE, null),
        { status: 409 },
      );
    }

    const treatmentMapping = await prisma.treatmentStripe.findUnique({
      where: {
        treatmentId: Number(treatmentId),
      },
    });

    if (!treatmentMapping) {
      console.error(
        "[PAID-BOOKING checkout] FAILED",
        { message: "No TreatmentStripe row", treatmentId },
      );

      return NextResponse.json(
        createResponse(false, "Treatment not found", null),
        { status: 404 },
      );
    }

    const origin =
      process.env.NEXT_PUBLIC_APP_URL || req.headers.get("origin") || "";

    const customer = await getOrCreateStripeCustomer(patient);

    const session = await stripe.checkout.sessions.create({
      customer,

      line_items: [
        {
          price: treatmentMapping.stripePriceId,
          quantity: 1,
        },
      ],

      mode: "payment",

      metadata: {
        payment_for: "wellness_appointment",

        treatment_id: String(treatmentId),

        practitioner_id: String(practitionerId),

        patient_id: String(dentallyId),

        start_time: parsedStartTime.toISOString(),

        finish_time: parsedFinishTime.toISOString(),

        reason: reason || "Wellness Appointment",
      },

      success_url: `${origin}/patient/appointments/upcoming?session_id={CHECKOUT_SESSION_ID}`,

      cancel_url: `${origin}/patient/plan-selection/wellness-treatments`,
    });

    console.log("[PAID-BOOKING checkout] Stripe session", {
      id: session.id,
      priceId: treatmentMapping.stripePriceId,
    });

    return NextResponse.json(
      createResponse(true, "Checkout session created", {
        checkoutUrl: session.url,
        sessionId: session.id,
      }),
    );
  } catch (error) {
    // console.error("Checkout error:", error);
    console.error("[PAID-BOOKING checkout] FAILED", {
      message: error instanceof Error ? error.message : String(error),
    });

    return NextResponse.json(
      createResponse(
        false,
        error instanceof Error ? error.message : "Checkout failed",
        null,
      ),
      { status: 500 },
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams;
    const sessionId = searchParams.get("session_id");

    if (!sessionId) {
      return NextResponse.json(
        createResponse(false, "Session ID is required.", null),
        { status: 400 },
      );
    }

    const session = await stripe.checkout.sessions.retrieve(sessionId);

    if (!session) {
      return NextResponse.json(
        createResponse(false, "Session not found.", null),
        { status: 404 },
      );
    }

    if (session.payment_status === "paid") {
      return NextResponse.json(
        createResponse(true, "Payment successful", null),
        { status: 200 },
      );
    } else if (session.payment_status === "no_payment_required") {
      return NextResponse.json(
        createResponse(true, "No payment required", null),
        { status: 204 },
      );
    } else if (session.payment_status === "unpaid") {
      return NextResponse.json(
        createResponse(false, "Payment unpaid or pending", null),
        { status: 402 },
      );
    } else {
      return NextResponse.json(
        createResponse(false, "Unknown payment status", null),
        { status: 500 },
      );
    }
  } catch (error) {
    // console.error("Stripe Error:", error);
    const errorMessage = error instanceof Error ? error.message : String(error);
    return NextResponse.json(createResponse(false, errorMessage, null), {
      status: 500,
    });
  }
}
