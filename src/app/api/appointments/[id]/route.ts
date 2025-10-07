import { TokenRoles } from "@/constants/UserRoles";
import prisma from "@/lib/db";
import { createResponse } from "@/utils/createResponse";
import { isValidCuid } from "@/utils/typeValidUtils";
import { ReferralRequestStatus } from "@prisma/client";
import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const token = await getToken({ req });

    let patientId = undefined;
    let dentistId = undefined;
    if (!token) {
      return NextResponse.json(createResponse(false, "Unauthorized", null), {
        status: 401,
      });
    }
    if (token.role === TokenRoles.PATIENT) {
      patientId = token.sub;
    } else if (
      token.role === TokenRoles.DENTIST ||
      token.role === TokenRoles.RECIEVING_DENTIST
    ) {
      dentistId = token.sub;
    } else if (token.role == TokenRoles.REFERRING_DENTIST) {
      return NextResponse.json(
        createResponse(false, "You are forbidden to view this data", null),
        {
          status: 403,
        }
      );
    }

    const appointmentId = req.nextUrl.pathname.split("/").pop();

    if (!appointmentId || !isValidCuid(appointmentId)) {
      return NextResponse.json(
        createResponse(false, "Invalid Appointment.", null),
        { status: 400 }
      );
    }

    const existingAppointment = await prisma.appointment.findUnique({
      where: { id: appointmentId },
    });

    if (!existingAppointment) {
      return NextResponse.json(
        createResponse(false, "Apppointmet does not exist.", null),
        { status: 404 }
      );
    }
    if (
      (patientId && existingAppointment?.patientId !== patientId) ||
      (dentistId && existingAppointment?.dentistId !== dentistId)
    ) {
      return NextResponse.json(
        createResponse(false, "You are forbidden to view this data", null),
        {
          status: 403,
        }
      );
    }

    const appoitnment = await prisma.appointment.findUnique({
      where: { id: appointmentId },
      include: { patient: true, dentist: true },
    });

    return NextResponse.json(
      createResponse(true, "Appointment fetched successfully.", appoitnment),
      { status: 200 }
    );
  } catch (error) {
    console.log("Error in fetched appointment ", error);
    const errorMessage = error instanceof Error ? error.message : String(error);
    return NextResponse.json(createResponse(false, errorMessage, null), {
      status: 500,
    });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

    if (!token) {
      return NextResponse.json(createResponse(false, "Unauthorized", null), {
        status: 401,
      });
    }

    const appointmentId = req.nextUrl.pathname.split("/").pop();
    const partialAppointment = await req.json();
    
    let patientId = undefined;
    let dentistId = undefined;
    if (token.role === TokenRoles.PATIENT) {
      patientId = token.sub;
    } else if (
      token.role === TokenRoles.DENTIST ||
      token.role === TokenRoles.RECIEVING_DENTIST
    ) {
      dentistId = token.sub;
    } else if (token.role == TokenRoles.REFERRING_DENTIST) {
      return NextResponse.json(
        createResponse(false, "You are forbidden to view this data", null),
        {
          status: 403,
        }
      );
    }

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

    if (token.role !== TokenRoles.ADMIN) {
      if (
        (patientId && patientId.trim().length > 0 && appointment.patientId !== patientId) ||
        (dentistId && dentistId.trim().length > 0 && appointment.dentistId !== dentistId)
      ) {
        return NextResponse.json(
          createResponse(
            false,
            "You are not authorized to update this appointment.",
            null
          ),
          { status: 403 }
        );
      }
    }

    const updatedAppointment = await prisma.appointment.update({
      where: { id: appointmentId },
      data: partialAppointment,
    });

    if (updatedAppointment.state === "CANCELLED") {
      const referralRequest = await prisma.referralRequest.findUnique({ where: { appointmentId: appointmentId } })

      // If this appointment has a linked referral request, unassign it
      if (referralRequest) {
        await prisma.referralRequest.update({
          where: { id: referralRequest.id },
          data: {
            appointmentId: null,
            assignedDentistId: null,
            requestStatus: ReferralRequestStatus.UNASSIGNED,
          },
        });
      }
    }

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
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

    if (!token) {
      return NextResponse.json(createResponse(false, "Unauthorized", null), {
        status: 401,
      });
    }

    // if (token.role === TokenRoles.PATIENT) {
    //   return NextResponse.json(createResponse(false, "Forbidden", null), {
    //     status: 403,
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
