import { stripe } from "@/config/stripe-config";
import prisma from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;
  try {
    const sessionId = searchParams.get("session_id");
    if (!sessionId) {
      throw new Error("Session ID is required.");
    }

    const session = await stripe.checkout.sessions.retrieve(sessionId);
    const metadata = session.metadata;

    if (!metadata || !metadata.userId) {
      throw new Error("Invalid metadata in payment intent.");
    }

    if (!session) {
      throw new Error("Session not found.");
    }

    if (!session.amount_total) {
      throw new Error("Invalid amount");
    }

    // invoice code

    if (session.payment_status === "paid") {
      prisma.payment.create({
        data: {
          userId: metadata.userId,
          stripePaymentId: session.payment_intent as string,
          amount: session.amount_total,
          status: "SUCCESSFUL",
        },
      });

      return NextResponse.json({
        status: 200,
        action: session.payment_status,
        message: "payment successful",
      });
    } else if (session.payment_status === "unpaid") {
      return NextResponse.json({
        status: 200,
        action: session.payment_status,
        message: "payment pending",
      });
    } else {
      return NextResponse.json({
        status: 200,
        action: session.payment_status,
        message: "payment failed",
      });
    }
  } catch (error) {
    console.error("Stripe Error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
