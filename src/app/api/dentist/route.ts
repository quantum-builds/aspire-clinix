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
      dentist.role !== DentistRole.REFERRING_DENTIST &&
      dentist.role !== DentistRole.DENTIST
    ) {
      return NextResponse.json(
        createResponse(false, "Invalid Dentist role", null),
        { status: 400 }
      );
    }

    const hashedPassword = await bcrypt.hash(dentist.password, 10);

    const result = await prisma.$transaction(async (tx) => {
      const newDentist = await tx.dentist.create({
        data: {
          email: dentist.email,
          password: hashedPassword,
          fullName: dentist.fullName,
          phoneNumber: dentist.phoneNumber,
          country: dentist.country,
          dateOfBirth: dentist.dateOfBirth,
          gender: dentist.gender,
          gdcNo: dentist.gdcNo,
          practiceAddress: dentist.practiceAddress,
          role: dentist.role,
          fileUrl: dentist.fileUrl,
        },
      });

      await tx.dentistOnPractice.create({
        data: {
          dentistId: newDentist.id,
          practiceId: dentist.practiceId,
        },
      });

      return newDentist;
    });

    return NextResponse.json(
      createResponse(true, "Dentist registered successfully", result),
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
