import { stripe } from "@/utils/stripe";
import { createResponse } from "@/utils/createResponse";
import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  const signature = req.headers.get("stripe-signature");

  if (!signature) {
    return NextResponse.json(
      createResponse(false, "Missing stripe-signature header", null),
      { status: 400 },
    );
  }

  let event;

  try {
    const body = await req.text();

    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_SECRET_WEBHOOK_KEY!,
    );
  } catch (error) {
    console.error("Stripe webhook signature verification failed:", error);

    return NextResponse.json(createResponse(false, "Invalid signature", null), {
      status: 400,
    });
  }

  try {
    if (event.type === "checkout.session.completed") {
      const session = event.data.object;
      const metadata = session.metadata;

      console.log("Stripe membership checkout completed:", {
        sessionId: session.id,
        paymentStatus: session.payment_status,
        metadata,
      });

      if (metadata?.payment_for === "membership") {
        const { planId, patientId } = metadata;

        if (!planId || !patientId) {
          console.error("Missing membership metadata:", metadata);

          return NextResponse.json(
            createResponse(
              false,
              "Missing required membership metadata",
              null,
            ),
            { status: 400 },
          );
        }

        if (session.payment_status !== "paid") {
          console.warn(
            "Checkout completed but payment is not marked as paid:",
            session.payment_status,
          );

          return NextResponse.json(
            createResponse(
              true,
              "Webhook received but payment is not yet paid",
              null,
            ),
          );
        }

        const dentallyId = Number(patientId);

        const patient = await prisma.patient.findUnique({
          where: { dentallyId },
        });

        if (!patient) {
          console.error("Patient not found for dentallyId:", dentallyId);

          return NextResponse.json(
            createResponse(false, "Patient not found", null),
            { status: 404 },
          );
        }

        const plan = await prisma.membershipPlan.findUnique({
          where: { id: planId },
        });

        if (!plan) {
          console.error("Membership plan not found:", planId);

          return NextResponse.json(
            createResponse(false, "Membership plan not found", null),
            { status: 404 },
          );
        }

        const stripeSubscriptionId = session.subscription as string;
        const stripeCustomerId = session.customer as string;

        let currentPeriodStart = new Date();
        let currentPeriodEnd = new Date();

        if (stripeSubscriptionId) {
          try {
            const subscription = await stripe.subscriptions.retrieve(
              stripeSubscriptionId,
            );
            currentPeriodStart = new Date(
              subscription.current_period_start * 1000,
            );
            currentPeriodEnd = new Date(
              subscription.current_period_end * 1000,
            );
          } catch (subError) {
            console.error(
              "Failed to retrieve Stripe subscription:",
              subError,
            );
          }
        }

        // Create the PatientMembership record
        await prisma.patientMembership.create({
          data: {
            patientId: patient.id,
            planId: plan.id,
            stripeCustomerId,
            stripeSubscriptionId,
            status: "ACTIVE",
            currentPeriodStart,
            currentPeriodEnd,
            cancelAtPeriodEnd: false,
            usedTreatments: 0,
            usedHyperbaric: 0,
            usedBreathwork: 0,
            usedGuestPasses: 0,
          },
        });

        console.log(
          "PatientMembership created successfully for patient:",
          patient.id,
          "plan:",
          plan.name,
        );
      }
    }

    if (event.type === "customer.subscription.updated") {
      const subscription = event.data.object;

      console.log("Stripe subscription updated:", {
        subscriptionId: subscription.id,
        status: subscription.status,
        currentPeriodStart: subscription.current_period_start,
        currentPeriodEnd: subscription.current_period_end,
      });

      const stripeSubscriptionId = subscription.id;

      const membership = await prisma.patientMembership.findUnique({
        where: { stripeSubscriptionId },
      });

      if (!membership) {
        console.error(
          "PatientMembership not found for subscription:",
          stripeSubscriptionId,
        );

        return NextResponse.json(
          createResponse(false, "Membership not found", null),
          { status: 404 },
        );
      }

      // If there's a pending upgrade, activate it now
      if (membership.pendingPlanId) {
        const newPlan = await prisma.membershipPlan.findUnique({
          where: { id: membership.pendingPlanId },
        });

        if (newPlan) {
          await prisma.patientMembership.update({
            where: { id: membership.id },
            data: {
              planId: newPlan.id,
              pendingPlanId: null,
              currentPeriodStart: new Date(
                subscription.current_period_start * 1000,
              ),
              currentPeriodEnd: new Date(
                subscription.current_period_end * 1000,
              ),
              usedTreatments: 0,
              usedHyperbaric: 0,
              usedBreathwork: 0,
              usedGuestPasses: 0,
            },
          });

          console.log(
            "Upgrade activated for membership:",
            membership.id,
            "new plan:",
            newPlan.name,
          );
        }
      } else {
        // Just update period dates and cancel status
        await prisma.patientMembership.update({
          where: { id: membership.id },
          data: {
            currentPeriodStart: new Date(
              subscription.current_period_start * 1000,
            ),
            currentPeriodEnd: new Date(
              subscription.current_period_end * 1000,
            ),
            cancelAtPeriodEnd: subscription.cancel_at_period_end,
            status:
              subscription.status === "canceled" ? "CANCELLED" : "ACTIVE",
          },
        });
      }
    }

    if (event.type === "customer.subscription.deleted") {
      const subscription = event.data.object;

      const membership = await prisma.patientMembership.findUnique({
        where: { stripeSubscriptionId: subscription.id },
      });

      if (membership) {
        await prisma.patientMembership.update({
          where: { id: membership.id },
          data: {
            status: "CANCELLED",
            cancelAtPeriodEnd: true,
            cancelledAt: new Date(),
            pendingPlanId: null,
          },
        });

        console.log("Membership cancelled:", membership.id);
      }
    }

    return NextResponse.json(createResponse(true, "Webhook received", null));
  } catch (error) {
    console.error("Stripe webhook processing error:", error);

    return NextResponse.json(
      createResponse(
        false,
        error instanceof Error ? error.message : "Webhook processing failed",
        null,
      ),
      { status: 500 },
    );
  }
}
