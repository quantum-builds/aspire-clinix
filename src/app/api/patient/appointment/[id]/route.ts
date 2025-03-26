import { ApiMethods } from "@/constants/ApiMethods";
import prisma from "@/lib/db";
import { isValidCuid } from "@/utils/typeValidUtils";
import { getServerSession } from "next-auth";
import { isDynamicServerError } from "next/dist/client/components/hooks-server-context";
import Error from "next/error";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;

  try {
    const appointmentId = searchParams.get("appointmentId");
    if (!appointmentId) {
      return NextResponse.json(
        { message: "Missing required parameter: id" },
        { status: 400 }
      );
    }

    if (!isValidCuid(appointmentId)) {
      return NextResponse.json(
        { message: "Invalid appointment ID format." },
        { status: 400 }
      );
    }

    const appointment = await prisma.appointment.findUnique({
      where: { id: appointmentId },
      include: {
        Dentist: true,
        Patient: true,
      },
    });

    if (!appointment) {
      return NextResponse.json(
        { message: "Appointment not found." },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        message: "Appointment fetched successfully.",
        data: appointment,
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: "Internal server error." },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;

  try {
    const appointmentId = searchParams.get("appointmentId");

    if (!appointmentId || !isValidCuid(appointmentId)) {
      return NextResponse.json(
        { message: "Invalid Appointment Id." },
        { status: 400 }
      );
    }

    const updatedAppointment = await req.json();
    const { dentistId, patientId } = updatedAppointment;

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

    await prisma.appointment.update({
      where: { id: appointmentId },
      data: updatedAppointment,
    });

    return NextResponse.json(
      { message: "Appointment updated successfully" },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
