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
    const { planId } = body;

    if (!planId) {
      return NextResponse.json(
        createResponse(false, "Plan ID is required", null),
        { status: 400 },
      );
    }

    // token.id is the patient's dentallyId
    const dentallyId = Number(token.id);

    if (Number.isNaN(dentallyId)) {
      return NextResponse.json(
        createResponse(false, "Invalid patient session", null),
        { status: 401 },
      );
    }

    // Look up Patient by dentallyId to get the cuid
    const patient = await prisma.patient.findUnique({
      where: { dentallyId },
    });

    if (!patient) {
      return NextResponse.json(
        createResponse(false, "Patient not found", null),
        { status: 404 },
      );
    }

    // Look up the membership plan by name (frontend sends plan name as planId)
    const plan = await prisma.membershipPlan.findFirst({
      where: { name: planId },
    });

    if (!plan) {
      return NextResponse.json(
        createResponse(false, "Membership plan not found", null),
        { status: 404 },
      );
    }

    if (!plan.isActive) {
      return NextResponse.json(
        createResponse(false, "This membership plan is not active", null),
        { status: 400 },
      );
    }

    const origin =
      process.env.NEXT_PUBLIC_APP_URL || req.headers.get("origin") || "";

    const session = await stripe.checkout.sessions.create({
      line_items: [
        {
          price: plan.stripePriceId,
          quantity: 1,
        },
      ],

      mode: "subscription",

      metadata: {
        payment_for: "membership",
        planId: plan.id,
        patientId: String(dentallyId),
      },

      success_url: `${origin}/patient/plan-selection/plans?payment=success`,
      cancel_url: `${origin}/patient/plan-selection/plans`,
    });

    return NextResponse.json(
      createResponse(true, "Checkout session created", {
        checkoutUrl: session.url,
        sessionId: session.id,
      }),
    );
  } catch (error) {
    console.error("Membership checkout error:", error);

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
