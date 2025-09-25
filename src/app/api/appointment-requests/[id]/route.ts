import prisma from "@/lib/db";
import { createResponse } from "@/utils/createResponse";
import { isValidCuid } from "@/utils/typeValidUtils";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  // const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

  // if (!token || token.role !== "patient") {
  //   return NextResponse.json(createResponse(false, "Unauthorized", null), {
  //     status: 401,
  //   });
  // }

  // get id from the token but for now will be getting in search params
  try {
    const appointmentRequestId = req.nextUrl.pathname.split("/").pop();

    if (!appointmentRequestId || !isValidCuid(appointmentRequestId)) {
      return NextResponse.json(
        { message: "Invalid Appointment Request Id." },
        { status: 400 }
      );
    }

    const appointmentRequest = await prisma.appointmentRequests.findUnique({
      where: { id: appointmentRequestId },
      include: { patient: true },
    });

    if (!appointmentRequest) {
      return NextResponse.json(
        createResponse(false, "No Appointment Request found", null),
        { status: 404 }
      );
    }

    return NextResponse.json(
      createResponse(
        true,
        "Appointment Request fetched successfully",
        appointmentRequest
      ),
      { status: 200 }
    );
  } catch (error) {
    console.log("Error in fetching appointment request", error);
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

    const appointmentRequestId = req.nextUrl.pathname.split("/").pop();
    const { searchParams } = new URL(req.url);
    const patientId = searchParams.get("patientId") || "";

    if (!appointmentRequestId || !isValidCuid(appointmentRequestId)) {
      return NextResponse.json(
        createResponse(false, "Invalid Appointment.", null),
        { status: 400 }
      );
    }

    const appointmentRequest = await prisma.appointmentRequests.findUnique({
      where: { id: appointmentRequestId },
    });

    if (!appointmentRequest) {
      return NextResponse.json(
        createResponse(false, "Apppointmet request does not exist.", null),
        { status: 404 }
      );
    }

    if (appointmentRequest.patientId !== patientId) {
      return NextResponse.json(
        createResponse(
          false,
          "You are not authorized to delete this appointment request.",
          null
        ),
        { status: 403 }
      );
    }

    await prisma.appointmentRequests.delete({
      where: { id: appointmentRequestId },
    });

    return NextResponse.json(
      createResponse(true, "Appointment request  deleted successfully.", null),
      { status: 200 }
    );
  } catch (error) {
    console.log("Error in deleting appointment request ", error);
    const errorMessage = error instanceof Error ? error.message : String(error);
    return NextResponse.json(createResponse(false, errorMessage, null), {
      status: 500,
    });
  }
}
