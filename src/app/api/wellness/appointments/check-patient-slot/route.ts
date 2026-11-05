import { createResponse } from "@/utils/createResponse";
import {
  PATIENT_OVERLAP_MESSAGE,
  patientHasOverlap,
} from "@/dentallyHelpers/patientOverlap";
import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";

/**
 * Checks the logged-in patient has no other Dentally appointment at the
 * chosen time, before the confirm modal or any payment.
 */
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

    const { startTime, finishTime } = await req.json();

    if (
      typeof startTime !== "string" ||
      typeof finishTime !== "string" ||
      Number.isNaN(new Date(startTime).getTime()) ||
      Number.isNaN(new Date(finishTime).getTime())
    ) {
      return NextResponse.json(
        createResponse(false, "Invalid appointment date/time", null),
        { status: 400 },
      );
    }

    const hasOverlap = await patientHasOverlap(
      dentallyId,
      startTime,
      finishTime,
    );

    if (hasOverlap) {
      return NextResponse.json(
        createResponse(true, PATIENT_OVERLAP_MESSAGE, {
          status: "PATIENT_OVERLAP",
        }),
        { status: 200 },
      );
    }

    return NextResponse.json(
      createResponse(true, "Slot is free for the patient", { status: "OK" }),
      { status: 200 },
    );
  } catch (error) {
    // console.error("Patient slot check error:", error);

    return NextResponse.json(
      createResponse(
        false,
        error instanceof Error ? error.message : "Patient slot check failed",
        null,
      ),
      { status: 500 },
    );
  }
}
