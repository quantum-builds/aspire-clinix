import { ApiMethods } from "@/constants/ApiMethods";
import prisma from "@/lib/db";
import { isValidCuid } from "@/utils/typeValidUtils";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  if (req.method !== ApiMethods.POST) {
    return NextResponse.json(
      { message: "Methond not allowed." },
      { status: 405 }
    );
  }

  const patientTreatment = await req.json();

  try {
    const { dentistId, patientId, treatmentId } = patientTreatment;
    const treatmentInfo = await prisma.treatment.findUnique({
      where: { id: treatmentId },
    });

    if (!treatmentInfo) {
      return NextResponse.json(
        {
          message: "The treatment patient trying to shceduled does not exist. ",
        },
        { status: 404 }
      );
    }


    console.log(dentistId + " " + patientId);

    if (!isValidCuid(dentistId) || !isValidCuid(patientId)) {
      return NextResponse.json(
        { message: "Invalid patient or dentist Id." },
        { status: 400 }
      );
    }

    const dentist = await prisma.dentist.findUnique({
      where: { id: dentistId },
    });

    if (!dentist) {
      return NextResponse.json(
        { message: "This doctor does not exists." },
        { status: 404 }
      );
    }

    const patient = await prisma.dentist.findUnique({
      where: { id: patientId },
    });

    if (!patient) {
      return NextResponse.json(
        { message: "This patient does not exists." },
        { status: 404 }
      );
    }

    await prisma.patientTreatment.create({
      data: patientTreatment,
    });

    return NextResponse.json(
      { message: "Patient treatment shceduled successfully. " },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
