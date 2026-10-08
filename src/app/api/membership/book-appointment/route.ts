import { createResponse } from "@/utils/createResponse";
import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { createAppointment } from "@/dentallyHelpers/appointment";
import { AppointmentReason } from "@/types/appointment";

const prisma = new PrismaClient();

const HYPERBARIC_TREATMENT_ID = 1367623;

export async function POST(req: NextRequest) {
  try {
    const token = await getToken({ req });

    if (!token) {
      return NextResponse.json(createResponse(false, "Unauthorized", null), {
        status: 401,
      });
    }

    const body = await req.json();
    const { treatmentId, practitionerId, startTime, finishTime, reason, patientId } =
      body;

    if (!treatmentId || !practitionerId || !startTime || !finishTime || !patientId) {
      return NextResponse.json(
        createResponse(false, "Missing required booking details", null),
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

    const membership = await prisma.patientMembership.findFirst({
      where: { patientId: patient.id, status: "ACTIVE" },
      include: {
        plan: true,
      },
    });

    if (!membership) {
      return NextResponse.json(
        createResponse(false, "No active membership found", null),
        { status: 400 },
      );
    }

    const plan = membership.plan;
    const isHyperbaric = Number(treatmentId) === HYPERBARIC_TREATMENT_ID;

    // Validate remaining treatments
    if (isHyperbaric) {
      if (
        plan.hyperbaricLimit !== null &&
        membership.usedHyperbaric >= plan.hyperbaricLimit
      ) {
        return NextResponse.json(
          createResponse(
            false,
            "No hyperbaric sessions remaining on your plan",
            null,
          ),
          { status: 400 },
        );
      }
    } else {
      if (
        plan.treatmentLimit !== null &&
        membership.usedTreatments >= plan.treatmentLimit
      ) {
        return NextResponse.json(
          createResponse(
            false,
            "No treatments remaining on your plan",
            null,
          ),
          { status: 400 },
        );
      }
    }

    // Create Dentally appointment
    const appointmentData = {
      startTime: new Date(startTime),
      finishTime: new Date(finishTime),
      practitionerId: Number(practitionerId),
      patientId: Number(patientId),
      reason: AppointmentReason.OTHER,
    };

    const result = await createAppointment(appointmentData);

    if (result.isError) {
      console.error("Failed to create Dentally appointment:", result.response);

      return NextResponse.json(
        createResponse(
          false,
          "Failed to create appointment. Please try again.",
          null,
        ),
        { status: 500 },
      );
    }

    const appointmentId = result.response?.id || result.response?.appointment?.id;

    // Update PatientMembership usage counters
    if (isHyperbaric) {
      await prisma.patientMembership.update({
        where: { id: membership.id },
        data: {
          usedHyperbaric: { increment: 1 },
        },
      });
    } else {
      await prisma.patientMembership.update({
        where: { id: membership.id },
        data: {
          usedTreatments: { increment: 1 },
        },
      });
    }

    // Create MembershipAppointment record
    await prisma.membershipAppointment.create({
      data: {
        membershipId: membership.id,
        appointmentId: String(appointmentId),
      },
    });

    return NextResponse.json(
      createResponse(true, "Appointment booked successfully", {
        appointmentId,
      }),
    );
  } catch (error) {
    console.error("Membership booking error:", error);

    return NextResponse.json(
      createResponse(
        false,
        error instanceof Error ? error.message : "Booking failed",
        null,
      ),
      { status: 500 },
    );
  }
}
