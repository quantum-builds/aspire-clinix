import { TokenRoles } from "@/constants/UserRoles";
import prisma from "@/lib/db";
import { createResponse } from "@/utils/createResponse";
import { isValidCuid } from "@/utils/typeValidUtils";
import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const token = await getToken({ req });

  if (!token) {
    return NextResponse.json(createResponse(false, "Unauthorized", null), {
      status: 401,
    });
  }

  if (token.role === TokenRoles.PATIENT || token.role === TokenRoles.ADMIN) {
    return NextResponse.json(createResponse(false, "Forbidden", null), {
      status: 403,
    });
  }

  try {
    const patientId = req.nextUrl.pathname.split("/").pop();

    if (!patientId || !isValidCuid(patientId)) {
      return NextResponse.json(
        { message: "Invalid Patient Id." },
        { status: 400 }
      );
    }

    if (token.role === TokenRoles.PATIENT && patientId !== token.sub) {
      return NextResponse.json(createResponse(false, "Forbidden", null), {
        status: 403,
      });
    }
    
    const patient = await prisma.patient.findUnique({
      where: { id: patientId },
      select: {
        id: true,
        email: true,
        fullName: true,
        phoneNumber: true,
        fileUrl: true,
        country: true,
        dateOfBirth: true,
        gender: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!patient) {
      return NextResponse.json(
        createResponse(false, "No Patient found", null),
        { status: 404 }
      );
    }

    return NextResponse.json(
      createResponse(true, "Patienst fetched successfully", patient),
      { status: 200 }
    );
  } catch (error) {
    console.log("Error in fetching patient", error);
    const errorMessage = error instanceof Error ? error.message : String(error);
    return NextResponse.json(createResponse(false, errorMessage, null), {
      status: 500,
    });
  }
}

export async function PATCH(req: NextRequest) {
  // const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

  // if (!token || token.role !== "patient") {
  //   return NextResponse.json(createResponse(false, "Unauthorized", null), {
  //     status: 401,
  //   });
  // }

  // get id from the token but for now will be getting in search params
  try {
    const patientId = req.nextUrl.pathname.split("/").pop();

    if (!patientId || !isValidCuid(patientId)) {
      return NextResponse.json(
        { message: "Invalid Patient Id." },
        { status: 400 }
      );
    }

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

export async function DELETE(req: NextRequest) {
  // const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

  // if (!token || token.role !== "patient") {
  //   return NextResponse.json(createResponse(false, "Unauthorized", null), {
  //     status: 401,
  //   });
  // }

  // get id from the token but for now will be getting in search params
  try {
    const patientId = req.nextUrl.pathname.split("/").pop();

    if (!patientId || !isValidCuid(patientId)) {
      return NextResponse.json(
        { message: "Invalid Patient Id." },
        { status: 400 }
      );
    }

    const patients = await prisma.patient.findUnique({
      where: { id: patientId },
    });

    if (!patients) {
      return NextResponse.json(
        createResponse(false, "No Patient found", null),
        { status: 404 }
      );
    }

    await prisma.patient.delete({ where: { id: patientId } });

    return NextResponse.json(
      createResponse(true, "Patient is deleted successfully", null),
      { status: 201 }
    );
  } catch (error) {
    console.log("Error in deleting patient", error);
    const errorMessage = error instanceof Error ? error.message : String(error);
    return NextResponse.json(createResponse(false, errorMessage, null), {
      status: 500,
    });
  }
}
