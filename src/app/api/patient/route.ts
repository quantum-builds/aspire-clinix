import prisma from "@/lib/db";
import bcrypt from "bcryptjs";
import { createResponse } from "@/utils/createResponse";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  try {
    const patients = await prisma.patient.findMany({});

    if (patients.length < 1) {
      return NextResponse.json(createResponse(false, "No Patient found", null));
    }

    return NextResponse.json(
      createResponse(true, "Patiensts fetched successfully", patients)
    );
  } catch (error) {
    console.log("Error in fetching patients ", error);
    const errorMessage = error instanceof Error ? error.message : String(error);
    return NextResponse.json(createResponse(false, errorMessage, null), {
      status: 500,
    });
  }
}

export async function POST(req: NextRequest) {
  try {
    const patient = await req.json();

    const existingDentist = await prisma.dentist.findUnique({
      where: { email: patient.email },
    });

    const existingPatient = await prisma.patient.findUnique({
      where: { email: patient.email },
    });

    if (existingDentist || existingPatient) {
      return NextResponse.json(
        createResponse(false, "User already exists", null),
        { status: 400 }
      );
    }

    const hashedPassword = await bcrypt.hash(patient.password, 10);

    const newPatient = await prisma.patient.create({
      data: {
        ...patient,
        password: hashedPassword,
      },
    });

    return NextResponse.json(
      createResponse(true, "Patient registered successfully", newPatient),
      { status: 201 }
    );
  } catch (error) {
    console.log("Error in creating patient ", error);
    const errorMessage = error instanceof Error ? error.message : String(error);
    return NextResponse.json(createResponse(false, errorMessage, null), {
      status: 500,
    });
  }
}
