import { stripe } from "@/utils/stripe";
import { createResponse } from "@/utils/createResponse";
import { NextRequest, NextResponse } from "next/server";
import { createAppointment } from "@/dentallyHelpers/appointment";
import { CreateAppointment } from "@/types/appointment";
import { AppointmentReason } from "@/types/appointment";

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

      console.log("Stripe checkout completed:", {
        sessionId: session.id,
        paymentStatus: session.payment_status,
        metadata,
      });

      if (metadata?.payment_for === "wellness_appointment") {
        const { start_time, finish_time, practitioner_id, patient_id, reason } =
          metadata;

        if (!start_time || !finish_time || !practitioner_id || !patient_id) {
          console.error("Missing Dentally appointment metadata:", metadata);

          return NextResponse.json(
            createResponse(
              false,
              "Missing required appointment metadata",
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

        const startTime = new Date(start_time);
        const finishTime = new Date(finish_time);

        if (
          Number.isNaN(startTime.getTime()) ||
          Number.isNaN(finishTime.getTime())
        ) {
          console.error("Invalid appointment date/time:", {
            start_time,
            finish_time,
          });

          return NextResponse.json(
            createResponse(false, "Invalid appointment date/time", null),
            { status: 400 },
          );
        }

        if (finishTime <= startTime) {
          console.error("Invalid appointment time range:", {
            start_time,
            finish_time,
          });

          return NextResponse.json(
            createResponse(false, "Finish time must be after start time", null),
            { status: 400 },
          );
        }

        const appointmentData: CreateAppointment = {
          startTime,
          finishTime,
          practitionerId: Number(practitioner_id),
          patientId: Number(patient_id),
          reason: AppointmentReason.OTHER,
        };

        if (
          Number.isNaN(appointmentData.practitionerId) ||
          Number.isNaN(appointmentData.patientId)
        ) {
          return NextResponse.json(
            createResponse(false, "Invalid practitioner or patient ID", null),
            { status: 400 },
          );
        }

        console.log(
          "Creating Dentally appointment with data:",
          appointmentData,
        );

        const result = await createAppointment(appointmentData);

        console.log("Dentally appointment result:", result);

        if (result.isError) {
          console.error(
            "Failed to create Dentally appointment:",
            result.response,
          );

          return NextResponse.json(
            createResponse(
              false,
              "Payment succeeded but Dentally appointment creation failed",
              result.response,
            ),
            { status: 500 },
          );
        }

        console.log(
          "Dentally appointment created successfully:",
          result.response,
        );
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
