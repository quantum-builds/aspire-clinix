import prisma from "@/lib/db";
import bcrypt from "bcryptjs";
import { createResponse } from "@/utils/createResponse";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  try {
    const admins = await prisma.admin.findMany({});

    if (admins.length < 1) {
      return NextResponse.json(createResponse(false, "No Admin found", null));
    }

    return NextResponse.json(
      createResponse(true, "Admins fetched successfully", admins)
    );
  } catch (error) {
    console.log("Error in fetching admins ", error);
    const errorMessage = error instanceof Error ? error.message : String(error);
    return NextResponse.json(createResponse(false, errorMessage, null), {
      status: 500,
    });
  }
}

export async function POST(req: NextRequest) {
  try {
    const admin = await req.json();

    const anyAdmin = await prisma.admin.findMany({});

    if (anyAdmin.length > 0) {
      return NextResponse.json(
        createResponse(false, "Admin already exist", null),
        { status: 400 }
      );
    }
    const existingDentist = await prisma.dentist.findFirst({
      where: {
        OR: [{ email: admin.email }, { phoneNumber: admin.phoneNumber }],
      },
    });

    const existingPatient = await prisma.patient.findFirst({
      where: {
        OR: [{ email: admin.email }, { phoneNumber: admin.phoneNumber }],
      },
    });
    if (existingDentist || existingPatient) {
      return NextResponse.json(
        createResponse(false, "User data already exists", null),
        { status: 400 }
      );
    }

    const hashedPassword = await bcrypt.hash(admin.password, 10);

    const newPatient = await prisma.admin.create({
      data: {
        ...admin,
        password: hashedPassword,
      },
    });

    return NextResponse.json(
      createResponse(true, "Admin registered successfully", newPatient),
      { status: 201 }
    );
  } catch (error) {
    console.log("Error in creating admin ", error);
    const errorMessage = error instanceof Error ? error.message : String(error);
    return NextResponse.json(createResponse(false, errorMessage, null), {
      status: 500,
    });
  }
}
