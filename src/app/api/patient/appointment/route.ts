import prisma from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";
import { ApiMethods } from "@/constants/ApiMethods";
import { isValidCuid } from "@/utils/typeValidUtils";

export async function POST(req: NextRequest) {
  if (req.method !== ApiMethods.POST) {
    return NextResponse.json(
      { message: "Methond not allowed." },
      { status: 405 }
    );
  }

  const appointment = await req.json();

  try {
    const { dentistId, patientId } = appointment;

    console.log(dentistId + " " + patientId);

    if (!isValidCuid(dentistId) || !isValidCuid(patientId)) {
      return NextResponse.json(
        { message: "Invalid patient or dentist Id." },
        { status: 400 }
      );
    }

    const dentist = await prisma.dentist.findUnique({
      where: { id: dentistId },
    });

    if (!dentist) {
      return NextResponse.json(
        { message: "This doctor does not exists." },
        { status: 404 }
      );
    }

    const patient = await prisma.dentist.findUnique({
      where: { id: patientId },
    });

    if (!patient) {
      return NextResponse.json(
        { message: "This patient does not exists." },
        { status: 404 }
      );
    }

    await prisma.appointment.create({
      data: appointment,
    });

    return NextResponse.json(
      { message: "Appointment sheduled successfully." },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
