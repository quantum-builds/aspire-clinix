import prisma from "@/lib/db";
import bcrypt from "bcryptjs";
import { createResponse } from "@/utils/createResponse";
import { NextRequest, NextResponse } from "next/server";
import { DentistRole } from "@prisma/client";

export async function GET() {
  try {
    const dentists = await prisma.dentist.findMany({});

    if (dentists.length < 1) {
      return NextResponse.json(createResponse(false, "No Dentist found", null));
    }

    return NextResponse.json(
      createResponse(true, "Dentists fetched successfully", dentists)
    );
  } catch (error) {
    console.log("Error in fetching dentists ", error);
    const errorMessage = error instanceof Error ? error.message : String(error);
    return NextResponse.json(createResponse(false, errorMessage, null), {
      status: 500,
    });
  }
}

export async function POST(req: NextRequest) {
  try {
    const dentist = await req.json();

    const existingDentist = await prisma.dentist.findFirst({
      where: {
        OR: [{ email: dentist.email }, { phoneNumber: dentist.phoneNumber }],
      },
    });

    const existingPatient = await prisma.patient.findFirst({
      where: {
        OR: [{ email: dentist.email }, { phoneNumber: dentist.phoneNumber }],
      },
    });

    const existingAdmin = await prisma.admin.findFirst({
      where: {
        OR: [{ email: dentist.email }, { phoneNumber: dentist.phoneNumber }],
      },
    });

    if (existingDentist || existingPatient || existingAdmin) {
      return NextResponse.json(
        createResponse(false, "User data already exists", null),
        { status: 400 }
      );
    }

    if (
      dentist.role !== DentistRole.RECIEVING_DENTIST &&
      dentist.role !== DentistRole.REFERRING_DENTIST
    ) {
      return NextResponse.json(
        createResponse(false, "Invalid Dentist role", null),
        { status: 400 }
      );
    }

    const hashedPassword = await bcrypt.hash(dentist.password, 10);

    const newDentist = await prisma.dentist.create({
      data: {
        ...dentist,
        password: hashedPassword,
      },
    });

    return NextResponse.json(
      createResponse(true, "Dentist registered successfully", newDentist),
      { status: 201 }
    );
  } catch (error) {
    console.log("Error in creating detist ", error);
    const errorMessage = error instanceof Error ? error.message : String(error);
    return NextResponse.json(createResponse(false, errorMessage, null), {
      status: 500,
    });
  }
}
