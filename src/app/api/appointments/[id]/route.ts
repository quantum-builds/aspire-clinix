import prisma from "@/lib/db";
import { createResponse } from "@/utils/createResponse";
import { isValidCuid } from "@/utils/typeValidUtils";
import { NextRequest, NextResponse } from "next/server";

// we will be geting the id of patient or dentist from token but for now give it in searchOaram
export async function PATCH(req: NextRequest) {
  try {
    // const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

    // if (!token || token.role !== "patient") {
    //   return NextResponse.json(createResponse(false, "Unauthorized", null), {
    //     status: 401,
    //   });
    // }

    const appointmentId = req.nextUrl.pathname.split("/").pop();
    const partialAppointment = await req.json();
    const { searchParams } = new URL(req.url);
    const patientId = searchParams.get("patientId") || undefined;
    const dentistId = searchParams.get("dentistId") || undefined;

    if (!appointmentId || !isValidCuid(appointmentId)) {
      return NextResponse.json(
        createResponse(false, "Invalid Appointment.", null),
        { status: 400 }
      );
    }

    const appointment = await prisma.appointment.findUnique({
      where: { id: appointmentId },
    });

    if (!appointment) {
      return NextResponse.json(
        createResponse(false, "Apppointmet does not exist.", null),
        { status: 404 }
      );
    }

    console.log("patient id is ", patientId);
    console.log("appointment patient id is ", appointment.patientId);

    console.log("dentist id is ", dentistId);
    console.log("appointment dentist id is ", appointment.dentistId);
    if (
      patientId &&
      patientId.trim().length > 0 &&
      appointment.patientId !== patientId
    ) {
      console.log("hey there in patient");
    }

    if (
      dentistId &&
      dentistId.trim().length > 0 &&
      appointment.dentistId !== dentistId
    ) {
      console.log("hey there in detist");
    }

    if (
      (patientId &&
        patientId.trim().length > 0 &&
        appointment.patientId !== patientId) ||
      (dentistId &&
        dentistId.trim().length > 0 &&
        appointment.dentistId !== dentistId)
    ) {
      return NextResponse.json(
        createResponse(
          false,
          "You are not authorized to updated this appointment.",
          null
        ),
        { status: 403 }
      );
    }

    const updatedAppointment = await prisma.appointment.update({
      where: { id: appointmentId },
      data: partialAppointment,
    });

    return NextResponse.json(
      createResponse(
        true,
        "Appointment Updated successfully.",
        updatedAppointment
      ),
      { status: 200 }
    );
  } catch (error) {
    console.log("Error in updating appointment ", error);
    const errorMessage = error instanceof Error ? error.message : String(error);
    return NextResponse.json(createResponse(false, errorMessage, null), {
      status: 500,
    });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    // const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

    // if (!token || token.role !== "patient") {
    //   return NextResponse.json(createResponse(false, "Unauthorized", null), {
    //     status: 401,
    //   });
    // }

    const appointmentId = req.nextUrl.pathname.split("/").pop();
    const { searchParams } = new URL(req.url);
    const patientId = searchParams.get("patientId") || "";

    if (!appointmentId || !isValidCuid(appointmentId)) {
      return NextResponse.json(
        createResponse(false, "Invalid Appointment.", null),
        { status: 400 }
      );
    }

    const appointment = await prisma.appointment.findUnique({
      where: { id: appointmentId },
    });

    if (!appointment) {
      return NextResponse.json(
        createResponse(false, "Apppointmet does not exist.", null),
        { status: 404 }
      );
    }

    if (appointment.patientId !== patientId) {
      return NextResponse.json(
        createResponse(
          false,
          "You are not authorized to delete this appointment.",
          null
        ),
        { status: 403 }
      );
    }

    await prisma.appointment.delete({
      where: { id: appointmentId },
    });

    return NextResponse.json(
      createResponse(true, "Appointment deleted successfully.", null),
      { status: 200 }
    );
  } catch (error) {
    console.log("Error in deleting appointment ", error);
    const errorMessage = error instanceof Error ? error.message : String(error);
    return NextResponse.json(createResponse(false, errorMessage, null), {
      status: 500,
    });
  }
}
