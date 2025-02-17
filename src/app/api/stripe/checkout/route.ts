import Stripe from "stripe";
import { NextRequest, NextResponse } from "next/server";
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);

export async function POST(request: NextRequest) {
  try {
    // you can implement some basic check here like, is user valid or not

    console.log("in checkout ");
    const data = await request.json();
    const priceId = data.priceId;
    console.log("price id is ", priceId);
    const checkoutSession: Stripe.Checkout.Session =
      await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        line_items: [
          {
            price: priceId,
            quantity: 1,
          },
        ],
        mode: "subscription",
        success_url: `http://localhost:3000/patient?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `http://localhost:3000/patient?session_id={CHECKOUT_SESSION_ID}`,
        metadata: {
          userId: 1,
          priceId,
        },
      });
    console.log("checkout session ", checkoutSession);
    return NextResponse.json({ result: checkoutSession, status: 200 });
  } catch (error) {
    console.log(error);
    return new NextResponse("Internal Server", { status: 500 });
  }
}
