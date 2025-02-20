import { ApiMethods } from "@/constants/ApiMethods";
import prisma from "@/lib/db";
import { isValidCuid } from "@/utils/typeValidUtils";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;
  // if (!patientId || !isValidCuid(patientId)) {
  //   return NextResponse.json(
  //     { message: "Invalid patient Id." },
  //     { status: 400 }
  //   );
  // }

  try {
    const patientId = searchParams.get("patientId");
    if (!patientId) {
      return NextResponse.json(
        { message: "Invalid patient Id." },
        { status: 400 }
      );
    }
    const patientTreatments = await prisma.patientTreatment.findMany({
      where: { patientId: patientId },
      include: { Treatment: true },
    });

    if (patientTreatments.length === 0) {
      return NextResponse.json(
        { message: "No patient treatment exist yet" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        message: "Patient treatments fetched successfully.",
        data: patientTreatments,
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

export async function POST(req: NextRequest) {
  try {
    const patientTreatment = await req.json();
    const { dentistId, patientId, treatmentId } = patientTreatment;
    const treatmentInfo = await prisma.treatment.findUnique({
      where: { id: treatmentId },
    });

    if (!treatmentInfo) {
      return NextResponse.json(
        {
          message: "The treatment patient trying to scheduled does not exist. ",
        },
        { status: 404 }
      );
    }

    // if (!isValidCuid(dentistId) || !isValidCuid(patientId)) {
    //   return NextResponse.json(
    //     { message: "Invalid patient or dentist Id." },
    //     { status: 400 }
    //   );
    // }

    // const dentist = await prisma.dentist.findUnique({
    //   where: { id: dentistId },
    // });

    // if (!dentist) {
    //   return NextResponse.json(
    //     { message: "This doctor does not exists." },
    //     { status: 404 }
    //   );
    // }

    // const patient = await prisma.dentist.findUnique({
    //   where: { id: patientId },
    // });

    // if (!patient) {
    //   return NextResponse.json(
    //     { message: "This patient does not exists." },
    //     { status: 404 }
    //   );
    // }

    await prisma.patientTreatment.create({
      data: patientTreatment,
    });

    return NextResponse.json(
      { message: "Patient treatment shceduled successfully. " },
      { status: 201 }
    );
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
