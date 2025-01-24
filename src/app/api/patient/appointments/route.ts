import { ApiMethods } from "@/constants/ApiMethods";
import prisma from "@/lib/db";
import { isValidCuid } from "@/utils/typeValidUtils";
import { Console } from "console";
import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  if (req.method !== ApiMethods.GET) {
    return NextResponse.json(
      { message: "Methond not allowed." },
      { status: 405 }
    );
  }

  // const patientId = req.nextUrl.searchParams.get("id");
  const token = await getToken({
    req: req,
    secret: process.env.NEXTAUTH_SECRET,
  });
  const userId = token?.sub;

  if (!userId || !isValidCuid(userId)) {
    return NextResponse.json(
      { message: "Invalid patient Id." },
      { status: 400 }
    );
  }

  try {
    const patient = await prisma.patient.findUnique({
      where: { userId: userId },
    });

    const appointments = await prisma.appointment.findMany({
      where: {
        patientId: patient?.id,
      },
      orderBy: {
        appointmentDate: "asc",
      },
      include: {
        Dentist: true,
        Patient: true,
      },
    });

    console.log("in appointments");
    // console.log(patient?.id);
    // console.log(appointments);
    if (appointments.length === 0) {
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
