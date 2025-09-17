export const dynamic = "force-dynamic";

import { stripe } from "@/config/stripe-config";
import { createResponse } from "@/utils/createResponse";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams;
    const sessionId = searchParams.get("session_id");

    if (!sessionId) {
      return NextResponse.json(
        createResponse(false, "Session ID is required.", null),
        { status: 400 }
      );
    }

    const session = await stripe.checkout.sessions.retrieve(sessionId);

    if (!session) {
      return NextResponse.json(
        createResponse(false, "Session not found.", null),
        { status: 404 }
      );
    }

    if (session.payment_status === "paid") {
      return NextResponse.json(
        createResponse(true, "Payment successful", null),
        { status: 200 }
      );
    } else if (session.payment_status === "no_payment_required") {
      return NextResponse.json(
        createResponse(true, "No payment required", null),
        { status: 204 }
      );
    } else if (session.payment_status === "unpaid") {
      return NextResponse.json(
        createResponse(false, "Payment unpaid or pending", null),
        { status: 402 }
      );
    } else {
      return NextResponse.json(
        createResponse(false, "Unknown payment status", null),
        { status: 500 }
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
