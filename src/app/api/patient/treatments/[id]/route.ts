import prisma from "@/lib/db";
import { isValidCuid } from "@/utils/typeValidUtils";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const patientTreatmentId = req.nextUrl.pathname.split("/").pop();
  if (!patientTreatmentId || !isValidCuid(patientTreatmentId)) {
    return NextResponse.json(
      { message: "Invalid patient treatment Id." },
      { status: 400 }
    );
  }

  try {
    const patientTreatment = await prisma.patientTreatment.findUnique({
      where: { id: patientTreatmentId },
      include: { Treatment: true },
    });

    if (!patientTreatment) {
      return NextResponse.json(
        { message: "This patient treatment does not exist." },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        message: "Patient Treatment data fetched successfully.",
        data: patientTreatment,
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
  const patientTreatmentId = req.nextUrl.pathname.split("/").pop();
  if (!patientTreatmentId || !isValidCuid(patientTreatmentId)) {
    return NextResponse.json(
      { message: "Invalid patient treatment Id." },
      { status: 400 }
    );
  }

  try {
    const updatedPatientTreatment = await req.json();
    // const { dentistId, patientId, treatmentId } = updatedPatientTreatment;
    // const treatmentInfo = await prisma.treatment.findUnique({
    //   where: { id: treatmentId },
    // });

    // if (!treatmentInfo) {
    //   return NextResponse.json(
    //     {
    //       message: "The treatment patient trying to shceduled does not exist. ",
    //     },
    //     { status: 404 }
    //   );
    // }

    // if (patientId && dentistId) {
    //   if (!isValidCuid(dentistId) || !isValidCuid(patientId)) {
    //     return NextResponse.json(
    //       { message: "Invalid patient or dentist Id." },
    //       { status: 400 }
    //     );
    //   }

    //   const dentist = await prisma.dentist.findUnique({
    //     where: { id: dentistId },
    //   });

    //   if (!dentist) {
    //     return NextResponse.json(
    //       { message: "This doctor does not exists." },
    //       { status: 404 }
    //     );
    //   }

    //   const patient = await prisma.dentist.findUnique({
    //     where: { id: patientId },
    //   });

    //   if (!patient) {
    //     return NextResponse.json(
    //       { message: "This patient does not exists." },
    //       { status: 404 }
    //     );
    //   }
    // }
    await prisma.patientTreatment.update({
      where: { id: patientTreatmentId },
      data: updatedPatientTreatment,
    });

    return NextResponse.json(
      { message: "Patient's treatment data updated successfully." },
      { status: 200 }
    );
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  const patientTreatmentId = req.nextUrl.pathname.split("/").pop();

  if (!patientTreatmentId || !isValidCuid(patientTreatmentId)) {
    return NextResponse.json(
      { message: "Invalid Paitent Treatment Id." },
      { status: 400 }
    );
  }

  try {
    const discount = await prisma.patientTreatment.findUnique({
      where: { id: patientTreatmentId },
    });

    if (!discount) {
      return NextResponse.json(
        { message: "Patient treatment with this Id does not exist." },
        { status: 404 }
      );
    }

    await prisma.patientTreatment.delete({
      where: { id: patientTreatmentId },
    });

    return NextResponse.json(
      { message: "Patient Treatment deleted successfully." },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
