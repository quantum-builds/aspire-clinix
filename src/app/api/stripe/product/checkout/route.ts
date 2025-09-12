import { stripe } from "@/config/stripe-config";
import { PurchasedProduct } from "@/types/common";
import { createResponse } from "@/utils/createResponse";
import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

export async function POST(req: NextRequest) {
  try {
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

    if (!token || token.role !== "patient") {
      return NextResponse.json(createResponse(false, "Unauthorized", null), {
        status: 401,
      });
    }

    const data = await req.json();

    const products: PurchasedProduct = data.products;

    if (!Array.isArray(products.products) || products.products.length === 0 || products.cartId===undefined)  {
      return NextResponse.json(
        createResponse(false, "No Product in the cart", null),
        { status: 400 }
      );
    }

    const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] = [];

    for (const product of products.products) {
      const productId = String( product.productId?? "").trim();
      const quantity = product.quantity ?? 1;

      if (!productId || typeof quantity !== "number" || quantity <= 0) {
        return NextResponse.json(
          createResponse(false, "Invalid cart item", null),
          { status: 400 }
        );
      }

      const prices = await stripe.prices.list({
        product: productId,
        active: true,
      });

      if (!prices.data.length) {
        return NextResponse.json(
          createResponse(
            false,
            `No price found for product ${productId}`,
            null
          ),
          { status: 404 }
        );
      }

      lineItems.push({
        price: prices.data[0].id,
        quantity,
      });
    }

    const checkoutSession = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: lineItems,
      mode: "payment",
      // customer_email: email,
      success_url: `${process.env.URL}/store?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.URL}/store?session_id={CHECKOUT_SESSION_ID}`,
      metadata: {
        products: JSON.stringify(products),
        payment_for: "product",
        patient_id: token.id as string,
      },
    });

    return NextResponse.json(
      createResponse(true, "Checkout session created", checkoutSession),
      { status: 200 }
    );
  } catch (error) {
    if (error instanceof Stripe.errors.StripeError) {
      return NextResponse.json(createResponse(false, error.message, null), {
        status: 400,
      });
    }

    const errorMessage = error instanceof Error ? error.message : String(error);
    return NextResponse.json(createResponse(false, errorMessage, null), {
      status: 500,
    });
  }
}
