import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { ApiMethods } from "@/constants/ApiMethods";
import prisma from "@/lib/db";
import { isValidCuid } from "@/utils/typeValidUtils";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  if (req.method !== ApiMethods.GET) {
    return NextResponse.json(
      { message: "Methond not allowed." },
      { status: 405 }
    );
  }

  const appointmentId = req.nextUrl.searchParams.get("id");

  try {
    if (!appointmentId || !isValidCuid(appointmentId)) {
      return NextResponse.json(
        { message: "Invalid Form Id." },
        { status: 400 }
      );
    }

    const appointment = await prisma.appointment.findUnique({
      where: {
        id: appointmentId,
      },
    });

    if (!appointment) {
      return NextResponse.json(
        { message: "This appointment does not exist." },
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
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest) {
  if (req.method !== ApiMethods.PUT) {
    return NextResponse.json(
      { message: "Methond not allowed." },
      { status: 405 }
    );
  }

  
  const appointmentId = req.nextUrl.searchParams.get("id");
  const session=await getServerSession(authOptions)
  
  if (!appointmentId || !isValidCuid(appointmentId)) {
    return NextResponse.json(
      { message: "Invalid Appointment Id." },
      { status: 400 }
    );
  }

  const updatedAppointment = req.json();

  try {
    
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
