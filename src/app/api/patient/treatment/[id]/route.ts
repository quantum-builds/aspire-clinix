import { ApiMethods } from "@/constants/ApiMethods";
import prisma from "@/lib/db";
import { isValidCuid } from "@/utils/typeValidUtils";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  if (req.method !== ApiMethods.GET) {
    return NextResponse.json(
      { message: "Methond not allowed." },
      { status: 405 }
    );
  }

  const patientTreatmentId = req.nextUrl.searchParams.get("id");
  if (!patientTreatmentId || !isValidCuid(patientTreatmentId)) {
    return NextResponse.json(
      { message: "Invalid patient treatment Id." },
      { status: 400 }
    );
  }

  try {
    const patientTreatment = await prisma.patientTreatment.findUnique({
      where: { id: patientTreatmentId },
    });

    if (!patientTreatment) {
      return NextResponse.json(
        { message: "This patient treatment does not exist." },
        { status: 404 }
      );
    }

    const treamentInfo = await prisma.treatment.findUnique({
      where: { id: patientTreatment.treatmentId },
    });

    if (!treamentInfo) {
      return NextResponse.json(
        { message: "This treatment does not exist." },
        { status: 404 }
      );
    }

    const response = {
      ...patientTreatment,
      treatment: treamentInfo,
    };

    return NextResponse.json(
      {
        message: "Patient Treatment data fetched successfully.",
        data: response,
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

  const patientTreatmentId = req.nextUrl.searchParams.get("id");
  if (!patientTreatmentId || !isValidCuid(patientTreatmentId)) {
    return NextResponse.json(
      { message: "Invalid patient treatment Id." },
      { status: 400 }
    );
  }

  const updatedPatientTreatment = req.json();

  try {
    await prisma.referralForm.update({
      where: { id: patientTreatmentId },
      data: updatedPatientTreatment,
    });

    return NextResponse.json(
      { message: "Patient's treatment data updated successfully." },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
