import prisma from "@/lib/db";
import bcrypt from "bcryptjs";
import { createResponse } from "@/utils/createResponse";
import { NextRequest, NextResponse } from "next/server";
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

    if (token.role === TokenRoles.PATIENT) {
      const patientId = token.sub;
      const patient = await prisma.patient.findUnique({
        where: { id: patientId },
      });
      if (!patient) {
        return NextResponse.json(
          createResponse(false, "No Patient found", patient),
          { status: 404 }
        );
      }

      return NextResponse.json(
        createResponse(true, "Patient record successfully fetched", patient),
        { status: 200 }
      );
    } else if (token.role === TokenRoles.ADMIN) {
      const { searchParams } = new URL(req.url);
      const emailParam = searchParams.get("email") || "";

      // decode URL-encoded email
      const email = decodeURIComponent(emailParam);
      console.log("email is ", email)
      if (email.trim().length > 0) {
        const patient = await prisma.patient.findUnique({ where: { email: email } })
        if (!patient) {
          return NextResponse.json(
            createResponse(false, "No Patient found", patient),
            { status: 404 }
          );
        }

        return NextResponse.json(
          createResponse(true, "Patiensts fetched successfully", patient),
          { status: 200 }
        );
      } else {
        const patients = await prisma.patient.findMany({});

        if (patients.length < 1) {
          return NextResponse.json(
            createResponse(false, "No Patient found", null), { status: 404 }
          );
        }

        return NextResponse.json(
          createResponse(true, "Patiensts fetched successfully", patients), { status: 200 }
        );
      }
    } else {
      return NextResponse.json(createResponse(false, "Forbidden", null), {
        status: 403,
      });
    }
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
    const email = patient.email;
    const phoneNumber = patient.phoneNumber;

    const existingDentist = await prisma.dentist.findFirst({
      where: {
        OR: [{ email: patient.email }, { phoneNumber: patient.phoneNumber }],
      },
    });

    const existingPatient = await prisma.patient.findFirst({
      where: {
        OR: [{ email: patient.email }, { phoneNumber: patient.phoneNumber }],
      },
    });

    const existingAdmin = await prisma.admin.findFirst({
      where: {
        OR: [{ email: patient.email }, { phoneNumber: patient.phoneNumber }],
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

    const referralForms = await prisma.referralForm.findMany({
      where: { patientEmail: patient.email },
      select: { id: true },
    });

    const hashedPassword = await bcrypt.hash(patient.password, 10);

    const newPatient = await prisma.patient.create({
      data: {
        ...patient,
        password: hashedPassword,
        referralForms: { connect: referralForms.map((r) => ({ id: r.id })) },
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

export async function PATCH(req: NextRequest) {
  try {
    const token = await getToken({ req });

    if (!token) {
      return NextResponse.json(createResponse(false, "Unauthorized", null), {
        status: 401,
      });
    }

    if (token.role !== TokenRoles.PATIENT) {
      return NextResponse.json(createResponse(false, "Forbidden", null), {
        status: 403,
      });
    }

    const patientId = token.sub;
    const patients = await prisma.patient.findUnique({
      where: { id: patientId },
    });

    if (!patients) {
      return NextResponse.json(
        createResponse(false, "No Patient found", null),
        { status: 404 }
      );
    }

    const partialPatient = await req.json();
    const email = partialPatient.email;
    const phoneNumber = partialPatient.phoneNumber;

    const existingDentist = await prisma.dentist.findFirst({
      where: {
        OR: [{ email: email }, { phoneNumber: phoneNumber }],
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

    const updatedPatient = await prisma.patient.update({
      where: { id: patientId },
      data: partialPatient,
    });

    return NextResponse.json(
      createResponse(true, "Patient is updated successfully", updatedPatient),
      { status: 200 }
    );
  } catch (error) {
    console.log("Error in updated patient", error);
    const errorMessage = error instanceof Error ? error.message : String(error);
    return NextResponse.json(createResponse(false, errorMessage, null), {
      status: 500,
    });
  }
}
