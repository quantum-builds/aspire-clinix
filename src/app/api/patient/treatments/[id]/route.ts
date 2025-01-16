import { ApiMethods } from "@/constants/ApiMethods";
import prisma from "@/lib/db";
import { isValidCuid } from "@/utils/typeValidUtils";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  if (req.method !== ApiMethods.GET) {
    return NextResponse.json(
      { message: "Methond not allowed." },
      { status: 405 }
    );
  }

  const patientId = req.nextUrl.searchParams.get("id");

  if (!patientId || !isValidCuid(patientId)) {
    return NextResponse.json(
      { message: "Invalid patient Id." },
      { status: 400 }
    );
  }

  try {
    const patientTreatments = await prisma.appointment.findMany({
      where: { patientId: patientId },
    });

    // =====================
    // --> also get the treatment info

    if (patientTreatments.length === 0) {
      return NextResponse.json(
        { message: "No patient treatment exist yet" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        message: "Patient treatments fetched successfully.",
        data: patientTreatments,
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
