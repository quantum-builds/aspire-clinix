import { ApiMethods } from "@/constants/ApiMethods";
import prisma from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  if (req.method !== ApiMethods.POST) {
    return NextResponse.json(
      { message: "Methond not allowed." },
      { status: 405 }
    );
  }

  const patientTreatment = await req.json();

  //   ==============
  // --->want to create

  try {
    const treatmentId = patientTreatment.treatmentId;
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
