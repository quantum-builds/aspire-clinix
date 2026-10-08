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
    });

    if (!currentMembership) {
      return NextResponse.json(
        createResponse(false, "No active membership found", null),
        { status: 400 },
      );
    }

    if (!currentMembership.pendingPlanId) {
      return NextResponse.json(
        createResponse(false, "No pending upgrade found", null),
        { status: 400 },
      );
    }

    // Look up the pending plan to get its price ID
    const pendingPlan = await prisma.membershipPlan.findUnique({
      where: { id: currentMembership.pendingPlanId },
    });

    if (!pendingPlan) {
      return NextResponse.json(
        createResponse(false, "Pending plan not found", null),
        { status: 404 },
      );
    }

    // Get the subscription to find the pending item
    const subscription = await stripe.subscriptions.retrieve(
      currentMembership.stripeSubscriptionId,
    );

    // Find the subscription item with the pending plan's price (to remove)
    const pendingItem = subscription.items.data.find(
      (item) => item.price.id === pendingPlan.stripePriceId,
    );

    // Only remove the pending item if there's more than one item in the subscription
    // (Stripe requires at least one active item)
    if (pendingItem && subscription.items.data.length > 1) {
      await stripe.subscriptionItems.del(pendingItem.id, {
        proration_behavior: "none",
      });
    }

    // Clear the pending upgrade
    await prisma.patientMembership.update({
      where: { id: currentMembership.id },
      data: {
        pendingPlanId: null,
      },
    });

    return NextResponse.json(
      createResponse(true, "Upgrade cancelled successfully", null),
    );
  } catch (error) {
    console.error("Cancel upgrade error:", error);

    return NextResponse.json(
      createResponse(
        false,
        error instanceof Error ? error.message : "Cancel upgrade failed",
        null,
      ),
      { status: 500 },
    );
  }
}
