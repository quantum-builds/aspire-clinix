import prisma from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";
import { ApiMethods } from "@/constants/ApiMethods";

export async function POST(req: NextRequest) {
  if (req.method !== ApiMethods.POST) {
    return NextResponse.json(
      { message: "Methond not allowed." },
      { status: 405 }
    );
  }

  const appointment = await req.json();

  try {
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
