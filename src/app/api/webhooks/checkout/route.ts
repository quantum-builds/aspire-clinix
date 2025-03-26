import Stripe from "stripe";
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import { stripe } from "@/config/stripe-config";


export async function POST(request: NextRequest) {
  const body = await request.text();

  const endpointSecret = process.env.STRIPE_SECRET_WEBHOOK_KEY!;
  const sig = request.headers.get("stripe-signature");
  let event: Stripe.Event;
  try {
    if (!sig) throw new Error("Missing Stripe signature header");
    event = stripe.webhooks.constructEvent(body, sig, endpointSecret);
  } catch (err) {
    console.error("Webhook signature verification failed.", err);
    return NextResponse.json({ error: "Webhook Error" }, { status: 400 });
  }

  const eventType = event.type;
  console.log("hfeufhehfheufei");

  switch (eventType) {
    case "checkout.session.completed":
    case "checkout.session.async_payment_succeeded":
      console.log("in handle success payment");
      await handlePaymentSuccess(event.data.object);
      break;

    case "payment_intent.payment_failed":
      console.log("in handle failed payment");
      await handlePaymentFailure(event.data.object);
      break;

    default:
      console.log(`Unhandled event type: ${event.type}`);
  }

  return NextResponse.json({ received: true, status: 200 });
}

const handlePaymentSuccess = async (eventObject: Stripe.Checkout.Session) => {
  try {
    const metadata = eventObject.metadata;

    if (!metadata || !metadata.userId) {
      throw new Error("Invalid metadata in payment intent.");
    }

    if (!eventObject.amount_total) {
      throw new Error("Invalid amount");
    }

    await prisma.payment.create({
      data: {
        userId: metadata.userId,
        stripePaymentId: eventObject.id,
        amount: eventObject.amount_total,
        status: "SUCCESSFUL",
      },
    });
    console.log("payment success stored successfully");
  } catch (error) {
    console.log("error in handle payment success ", error);
  }
};

const handlePaymentFailure = async (eventObject: Stripe.PaymentIntent) => {
  try {
    const metadata = eventObject.metadata;

    if (!metadata || !metadata.userId) {
      throw new Error("Invalid metadata in payment intent.");
    }

    if (!eventObject.amount) {
      throw new Error("Invalid amount");
    }

    await prisma.payment.create({
      data: {
        userId: metadata.userId,
        stripePaymentId: eventObject.id,
        amount: eventObject.amount / 100,
        status: "FAILED",
      },
    });
    console.log("payment failed stored successful");
  } catch (error) {
    console.log("error in handling payment failure ", error);
  }
};
