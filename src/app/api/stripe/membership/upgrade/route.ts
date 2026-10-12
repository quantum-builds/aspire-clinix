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
    const { newPlanId } = body;

    if (!newPlanId) {
      return NextResponse.json(
        createResponse(false, "New plan ID is required", null),
        { status: 400 },
      );
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

    const currentMembership = await prisma.patientMembership.findFirst({
      where: { patientId: patient.id, status: "ACTIVE" },
      include: {
        plan: { select: { stripePriceId: true } },
      },
    });

    if (!currentMembership) {
      return NextResponse.json(
        createResponse(false, "No active membership found", null),
        { status: 400 },
      );
    }

    const newPlan = await prisma.membershipPlan.findFirst({
      where: { name: newPlanId },
    });

    if (!newPlan) {
      return NextResponse.json(
        createResponse(false, "New plan not found", null),
        { status: 404 },
      );
    }

    if (!newPlan.isActive) {
      return NextResponse.json(
        createResponse(false, "New plan is not active", null),
        { status: 400 },
      );
    }

    if (currentMembership.planId === newPlan.id) {
      return NextResponse.json(
        createResponse(false, "Patient is already on this plan", null),
        { status: 400 },
      );
    }

    // Get the subscription to find the current item
    const subscription = await stripe.subscriptions.retrieve(
      currentMembership.stripeSubscriptionId,
    );

    // Find the subscription item with the current plan's price (to update)
    const currentItem = subscription.items.data.find(
      (item) => item.price.id === currentMembership.plan.stripePriceId,
    );

    // Update the existing item to the new price (no proration)
    if (currentItem) {
      await stripe.subscriptionItems.update(currentItem.id, {
        price: newPlan.stripePriceId,
        proration_behavior: "none",
      });
    }

    // Update PatientMembership with pending upgrade
    await prisma.patientMembership.update({
      where: { id: currentMembership.id },
      data: {
        pendingPlanId: newPlan.id,
      },
    });

    return NextResponse.json(
      createResponse(true, "Upgrade scheduled successfully", {
        pendingPlanId: newPlan.id,
        effectiveDate: currentMembership.currentPeriodEnd,
      }),
    );
  } catch (error) {
    console.error("Membership upgrade error:", error);

    return NextResponse.json(
      createResponse(
        false,
        error instanceof Error ? error.message : "Upgrade failed",
        null,
      ),
      { status: 500 },
    );
  }
}
