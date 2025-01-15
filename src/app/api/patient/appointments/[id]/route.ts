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

  try {
    if (!patientId || !isValidCuid(patientId)) {
      return NextResponse.json(
        { message: "Invalid Form Id." },
        { status: 400 }
      );
    }

    const appointments = await prisma.appointment.findMany({
      where: {
        patientId: patientId,
      },
    });

    if (!appointments) {
      return NextResponse.json(
        { message: "Appointment for this patient does not exists." },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        message: "Appointments fetched successfully.",
        data: appointments,
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
