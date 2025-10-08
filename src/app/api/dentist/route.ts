import prisma from "@/lib/db";
import bcrypt from "bcryptjs";
import { createResponse } from "@/utils/createResponse";
import { NextRequest, NextResponse } from "next/server";
import { DentistRole } from "@prisma/client";
import { getToken } from "next-auth/jwt";
import { TokenRoles } from "@/constants/UserRoles";

export async function GET(req: NextRequest) {
  try {
    const token = await getToken({ req });

    if (!token) {
      return NextResponse.json(createResponse(false, "Unauthorized", null), {
        status: 401,
      });
    }

    if (
      token.role === TokenRoles.DENTIST ||
      token.role === TokenRoles.RECIEVING_DENTIST ||
      token.role === TokenRoles.REFERRING_DENTIST
    ) {
      const dentistId = token.sub;
      const dentist = await prisma.dentist.findUnique({
        where: { id: dentistId },
      });
      if (!dentist) {
        return NextResponse.json(
          createResponse(false, "No Dentist found", dentist),
          { status: 404 }
        );
      }

      const request = await prisma.dentistOnPractice.findFirst({
        where: { dentistId },
        include: { dentist: true, practice: true },
      });

      return NextResponse.json(
        createResponse(
          true,
          "Dentist record successfully fetched",

          {
            dentist,
            request,
          }
        ),
        { status: 200 }
      );
    } else if (token.role === TokenRoles.ADMIN) {
      const dentists = await prisma.dentist.findMany({});

      if (dentists.length < 1) {
        return NextResponse.json(
          createResponse(false, "No Dentist found", null)
        );
      }

      return NextResponse.json(
        createResponse(true, "Dentists fetched successfully", dentists)
      );
    } else {
      return NextResponse.json(createResponse(false, "Forbidden", null), {
        status: 403,
      });
    }
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
    const email = dentist.email;
    const phoneNumber = dentist.phoneNumber;
    const gdc = dentist.gdcNo;

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

    // if (existingDentist || existingPatient || existingAdmin) {
    //   return NextResponse.json(
    //     createResponse(false, "User data already exists", null),
    //     { status: 400 }
    //   );
    // }

    const conflicts: string[] = [];

    if (existingDentist) {
      if (existingDentist.email === email) conflicts.push("email");
      if (existingDentist.phoneNumber === phoneNumber) conflicts.push("phone number");
      if (existingDentist.gdcNo === gdc) conflicts.push("GDC number");
    }

    if (existingPatient) {
      if (existingPatient.email === email) conflicts.push("email");
      if (existingPatient.phoneNumber === phoneNumber) conflicts.push("phone number");
    }

    if (existingAdmin) {
      if (existingAdmin.email === email) conflicts.push("email");
      if (existingAdmin.phoneNumber === phoneNumber) conflicts.push("phone number");
    }

    const uniqueConflicts = Array.from(new Set(conflicts));

    if (uniqueConflicts.length > 0) {
      return NextResponse.json(
        createResponse(
          false,
          `The following fields are already in use: ${uniqueConflicts.join(", ")}`,
          null
        ),
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
    const referralForms = await prisma.referralForm.findMany({
      where: { referralEmail: dentist.email },
      select: { id: true },
    });

    if (referralForms.length > 0) {
      dentist.role = DentistRole.DENTIST;
    }

    const hashedPassword = await bcrypt.hash(dentist.password, 10);

    const result = await prisma.$transaction(async (tx) => {
      const newDentist = await tx.dentist.create({
        data: {
          ...dentist,
          password: hashedPassword,
          referralForms: { connect: referralForms.map((r) => ({ id: r.id })) },
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

export async function PATCH(req: NextRequest) {
  try {
    const token = await getToken({ req });

    if (!token) {
      return NextResponse.json(createResponse(false, "Unauthorized", null), {
        status: 401,
      });
    }

    if (token.role === TokenRoles.ADMIN || token.role === TokenRoles.PATIENT) {
      return NextResponse.json(createResponse(false, "Forbidden", null), {
        status: 403,
      });
    }

    const dentistId = token.sub;
    const dentist = await prisma.dentist.findUnique({
      where: { id: dentistId },
    });

    if (!dentist) {
      return NextResponse.json(
        createResponse(false, "No Dentist found", null),
        { status: 404 }
      );
    }

    const partialDentist = await req.json();
    const email = partialDentist.email;
    const phoneNumber = partialDentist.phoneNumber;
    const gdc = partialDentist.gdcNo;

    const existingDentist = await prisma.dentist.findFirst({
      where: {
        OR: [{ email: email }, { phoneNumber: phoneNumber }, { gdcNo: gdc }],
      },
    });

    const existingPatient = await prisma.patient.findFirst({
      where: {
        OR: [{ email: email }, { phoneNumber: phoneNumber }],
      },
    });

    const existingAdmin = await prisma.admin.findFirst({
      where: {
        OR: [{ email: email }, { phoneNumber: phoneNumber }],
      },
    });

    // if (existingDentist || existingPatient || existingAdmin) {
    //   return NextResponse.json(
    //     createResponse(false, "User data already exists", null),
    //     { status: 400 }
    //   );
    // }

    const conflicts: string[] = [];

    if (existingDentist) {
      if (existingDentist.email === email) conflicts.push("email");
      if (existingDentist.phoneNumber === phoneNumber) conflicts.push("phone number");
      if (existingDentist.gdcNo === gdc) conflicts.push("GDC number");
    }

    if (existingPatient) {
      if (existingPatient.email === email) conflicts.push("email");
      if (existingPatient.phoneNumber === phoneNumber) conflicts.push("phone number");
    }

    if (existingAdmin) {
      if (existingAdmin.email === email) conflicts.push("email");
      if (existingAdmin.phoneNumber === phoneNumber) conflicts.push("phone number");
    }

    const uniqueConflicts = Array.from(new Set(conflicts));

    if (uniqueConflicts.length > 0) {
      return NextResponse.json(
        createResponse(
          false,
          `The following fields are already in use: ${uniqueConflicts.join(", ")}`,
          null
        ),
        { status: 400 }
      );
    }

    const updatedDentist = await prisma.dentist.update({
      where: { id: dentistId },
      data: partialDentist,
    });

    return NextResponse.json(
      createResponse(true, "Dentist is updated successfully", updatedDentist),
      { status: 200 }
    );
  } catch (error) {
    console.log("Error in updated dentist", error);
    const errorMessage = error instanceof Error ? error.message : String(error);
    return NextResponse.json(createResponse(false, errorMessage, null), {
      status: 500,
    });
  }
}
