import { stripe } from "@/utils/stripe";
import { createResponse } from "@/utils/createResponse";
import { NextRequest, NextResponse } from "next/server";
import { createAppointment } from "@/dentallyHelpers/appointment";
import { CreateAppointment } from "@/types/appointment";
import prisma from "@/lib/db";
import {
  reserveTreatmentSlot,
  TreatmentSlotException,
} from "@/lib/treatment-session";
import { TIMEZONE } from "@/utils/slotSelectionUtils";
import { fromZonedTime } from "date-fns-tz";

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
          reason: reason || "Wellness Appointment",
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

      if (metadata?.payment_for === "treatment_session") {
        const { treatment_id, patient_id, date, start_time } = metadata;

        if (!treatment_id || !patient_id || !date || !start_time) {
          console.error("Missing treatment session metadata:", metadata);

          return NextResponse.json(
            createResponse(false, "Missing required session metadata", null),
            { status: 400 },
          );
        }

        if (session.payment_status !== "paid") {
          console.warn(
            "Treatment session checkout completed but not paid:",
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

        const dentallyId = Number(patient_id);
        const patient = await prisma.patient.findUnique({
          where: { dentallyId },
        });

        if (!patient) {
          console.error("Patient not found for treatment session:", patient_id);

          return NextResponse.json(
            createResponse(false, "Patient not found", null),
            { status: 400 },
          );
        }

        try {
          const created = await prisma.$transaction(async (tx) => {
            // Webhook retries must not book or decrement twice. This runs
            // before slot validation, since our own earlier booking may have
            // filled the slot.
            const duplicate = await tx.session.findFirst({
              where: {
                patientId: dentallyId,
                treatmentId: treatment_id,
                startTime: fromZonedTime(`${date}T${start_time}:00`, TIMEZONE),
              },
            });

            if (duplicate) {
              return null;
            }

            const { treatment: reservedTreatment, start, end } =
              await reserveTreatmentSlot(
              tx,
              treatment_id,
              date,
              start_time,
            );

            return tx.session.create({
              data: {
                patientId: dentallyId,
                patientName: patient.name,
                practitionerId: reservedTreatment.practitionerId
                  ? Number(reservedTreatment.practitionerId)
                  : null,
                practitionerName: reservedTreatment.practitionerName,
                treatmentId: treatment_id,
                startTime: start,
                endTime: end,
              },
            });
          });

          console.log(
            created
              ? `Treatment session created: ${created.id}`
              : "Treatment session already exists, skipping duplicate webhook",
          );
        } catch (error) {
          if (
            error instanceof TreatmentSlotException &&
            error.code !== "SLOT_CONFLICT"
          ) {
            // The slot can no longer be booked (full, removed or in the
            // past), so return the payment instead of creating a session.
            console.error(
              "Treatment session slot unavailable after payment, refunding:",
              error.code,
            );

            if (session.payment_intent) {
              await stripe.refunds.create({
                payment_intent: session.payment_intent as string,
              });
            }

            return NextResponse.json(
              createResponse(true, "Slot unavailable, payment refunded", null),
            );
          }

          // SLOT_CONFLICT and unexpected errors return 500 so Stripe retries.
          throw error;
        }
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
