import { stripe } from "@/utils/stripe";
import { createResponse } from "@/utils/createResponse";
import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  try {
    const token = await getToken({ req });

    if (!token) {
      return NextResponse.json(createResponse(false, "Unauthorized", null), {
        status: 401,
      });
    }

    const body = await req.json();

    const {
      treatmentId,
      practitionerId,
      startTime,
      finishTime,
      reason,
      patientId,
    } = body;

    if (
      !treatmentId ||
      !practitionerId ||
      !startTime ||
      !finishTime ||
      !patientId
    ) {
      return NextResponse.json(
        createResponse(false, "Missing required booking details", null),
        { status: 400 },
      );
    }

    const parsedStartTime = new Date(startTime);
    const parsedFinishTime = new Date(finishTime);

    if (
      Number.isNaN(parsedStartTime.getTime()) ||
      Number.isNaN(parsedFinishTime.getTime())
    ) {
      return NextResponse.json(
        createResponse(false, "Invalid appointment date/time", null),
        { status: 400 },
      );
    }

    if (parsedFinishTime <= parsedStartTime) {
      return NextResponse.json(
        createResponse(
          false,
          "Finish time must be greater than start time",
          null,
        ),
        { status: 400 },
      );
    }

    const treatmentMapping = await prisma.treatmentStripe.findUnique({
      where: {
        treatmentId: Number(treatmentId),
      },
    });

    if (!treatmentMapping) {
      return NextResponse.json(
        createResponse(false, "Treatment not found", null),
        { status: 404 },
      );
    }

    const origin =
      process.env.NEXT_PUBLIC_APP_URL || req.headers.get("origin") || "";

    const session = await stripe.checkout.sessions.create({
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

        patient_id: String(patientId),

        start_time: parsedStartTime.toISOString(),

        finish_time: parsedFinishTime.toISOString(),

        reason: reason || "Wellness Appointment",
      },

      success_url: `${origin}/patient/appointments/upcoming?session_id={CHECKOUT_SESSION_ID}`,

      cancel_url: `${origin}/patient/plan-selection`,
    });

    return NextResponse.json(
      createResponse(true, "Checkout session created", {
        checkoutUrl: session.url,
        sessionId: session.id,
      }),
    );
  } catch (error) {
    console.error("Checkout error:", error);

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
    console.error("Stripe Error:", error);
    const errorMessage = error instanceof Error ? error.message : String(error);
    return NextResponse.json(createResponse(false, errorMessage, null), {
      status: 500,
    });
  }
}
