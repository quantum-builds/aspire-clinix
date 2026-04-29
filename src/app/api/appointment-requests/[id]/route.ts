import prisma from "@/lib/db";
import { createResponse } from "@/utils/createResponse";
import { isValidCuid } from "@/utils/typeValidUtils";
import { NextRequest, NextResponse } from "next/server";

/**
 * @swagger
 * /api/appointment-requests/{id}:
 *   get:
 *     summary: Get an appointment request by ID
 *     tags: [Appointment Requests]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Appointment request ID (CUID)
 *     responses:
 *       200:
 *         description: Appointment request fetched successfully
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               message: "Appointment Request fetched successfully"
 *               data:
 *                 id: "ckx1r2a3b0001s2v1b1b2c3d4"
 *                 appointmentId: "ckx1r2a3b0002s2v1b1b2c3d4"
 *                 patientId: "ckx1r2a3b0003s2v1b1b2c3d4"
 *                 requestedDate: "2026-05-15T14:00:00.000Z"
 *                 reason: "Tooth pain"
 *                 status: "PENDING"
 *                 note: "Please schedule at your earliest convenience"
 *                 fileUrl: null
 *                 createdAt: "2026-04-29T10:00:00.000Z"
 *                 updatedAt: "2026-04-29T10:00:00.000Z"
 *       400:
 *         description: Invalid Appointment Request Id
 *         content:
 *           application/json:
 *             example:
 *               message: "Invalid Appointment Request Id."
 *       404:
 *         description: No appointment request found
 *         content:
 *           application/json:
 *             example:
 *               status: false
 *               message: "No Appointment Request found"
 *               data: null
 *       500:
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             example:
 *               status: false
 *               message: "Internal Server Error"
 *               data: null
 *   delete:
 *     summary: Delete an appointment request by ID
 *     tags: [Appointment Requests]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Appointment request ID (CUID)
 *       - in: query
 *         name: patientId
 *         schema:
 *           type: string
 *         description: Patient ID used to authorize deletion
 *     responses:
 *       200:
 *         description: Appointment request deleted successfully
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               message: "Appointment request  deleted successfully."
 *               data: null
 *       400:
 *         description: Invalid Appointment
 *         content:
 *           application/json:
 *             example:
 *               status: false
 *               message: "Invalid Appointment."
 *               data: null
 *       403:
 *         description: Unauthorized to delete this appointment request
 *         content:
 *           application/json:
 *             example:
 *               status: false
 *               message: "You are not authorized to delete this appointment request."
 *               data: null
 *       404:
 *         description: Appointment request does not exist
 *         content:
 *           application/json:
 *             example:
 *               status: false
 *               message: "Apppointmet request does not exist."
 *               data: null
 *       500:
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             example:
 *               status: false
 *               message: "Internal Server Error"
 *               data: null
 *   patch:
 *     summary: Update an appointment request by ID
 *     tags: [Appointment Requests]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Appointment request ID (CUID)
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status:
 *                 type: string
 *                 description: Status of the appointment request
 *               notes:
 *                 type: string
 *                 description: Notes for the appointment request
 *               date:
 *                 type: string
 *                 format: date-time
 *                 description: Appointment date and time
 *             example:
 *               status: CONFIRMED
 *               notes: Updated appointment details
 *               date: '2026-05-15T10:30:00Z'
 *     responses:
 *       200:
 *         description: Appointment request updated successfully
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               message: "Appointment request Updated successfully."
 *               data:
 *                 id: "ckx1r2a3b0001s2v1b1b2c3d4"
 *                 appointmentId: "ckx1r2a3b0002s2v1b1b2c3d4"
 *                 patientId: "ckx1r2a3b0003s2v1b1b2c3d4"
 *                 requestedDate: "2026-05-15T14:00:00.000Z"
 *                 reason: "Tooth pain"
 *                 status: "APPROVED"
 *                 note: "Updated appointment details"
 *                 fileUrl: null
 *                 createdAt: "2026-04-29T10:00:00.000Z"
 *                 updatedAt: "2026-04-29T10:30:00.000Z"
 *       400:
 *         description: Invalid Appointment Request id
 *         content:
 *           application/json:
 *             example:
 *               status: false
 *               message: "Invalid Appointment Request id."
 *               data: null
 *       404:
 *         description: Appointment request does not exist
 *         content:
 *           application/json:
 *             example:
 *               status: false
 *               message: "Apppointmet request does not exist."
 *               data: null
 *       500:
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             example:
 *               status: false
 *               message: "Internal Server Error"
 *               data: null
 */
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
        { status: 400 },
      );
    }

    const appointmentRequest = await prisma.appointmentRequests.findUnique({
      where: { id: appointmentRequestId },
      // include: { patient: true },
    });

    if (!appointmentRequest) {
      return NextResponse.json(
        createResponse(false, "No Appointment Request found", null),
        { status: 404 },
      );
    }

    return NextResponse.json(
      createResponse(
        true,
        "Appointment Request fetched successfully",
        appointmentRequest,
      ),
      { status: 200 },
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
        { status: 400 },
      );
    }

    const appointmentRequest = await prisma.appointmentRequests.findUnique({
      where: { id: appointmentRequestId },
    });

    if (!appointmentRequest) {
      return NextResponse.json(
        createResponse(false, "Apppointmet request does not exist.", null),
        { status: 404 },
      );
    }

    if (appointmentRequest.patientId !== patientId) {
      return NextResponse.json(
        createResponse(
          false,
          "You are not authorized to delete this appointment request.",
          null,
        ),
        { status: 403 },
      );
    }

    await prisma.appointmentRequests.delete({
      where: { id: appointmentRequestId },
    });

    return NextResponse.json(
      createResponse(true, "Appointment request  deleted successfully.", null),
      { status: 200 },
    );
  } catch (error) {
    console.log("Error in deleting appointment request ", error);
    const errorMessage = error instanceof Error ? error.message : String(error);
    return NextResponse.json(createResponse(false, errorMessage, null), {
      status: 500,
    });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    // const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

    // if (!token || token.role !== "patient") {
    //   return NextResponse.json(createResponse(false, "Unauthorized", null), {
    //     status: 401,
    //   });
    // }

    const appointmentRequestId = req.nextUrl.pathname.split("/").pop();
    const partialAppointmentRequest = await req.json();
    // const { searchParams } = new URL(req.url);
    // const patientId = searchParams.get("patientId") || "";

    if (!appointmentRequestId || !isValidCuid(appointmentRequestId)) {
      return NextResponse.json(
        createResponse(false, "Invalid Appointment Request id.", null),
        { status: 400 },
      );
    }

    const appointment = await prisma.appointmentRequests.findUnique({
      where: { id: appointmentRequestId },
    });

    if (!appointment) {
      return NextResponse.json(
        createResponse(false, "Apppointmet request does not exist.", null),
        { status: 404 },
      );
    }

    // if (appointment.patientId !== patientId) {
    //   return NextResponse.json(
    //     createResponse(
    //       false,
    //       "You are not authorized to updated this appointment.",
    //       null
    //     ),
    //     { status: 403 }
    //   );
    // }

    const updatedAppointment = await prisma.appointmentRequests.update({
      where: { id: appointmentRequestId },
      data: partialAppointmentRequest,
    });

    return NextResponse.json(
      createResponse(
        true,
        "Appointment request Updated successfully.",
        updatedAppointment,
      ),
      { status: 200 },
    );
  } catch (error) {
    console.log("Error in updating appointment request", error);
    const errorMessage = error instanceof Error ? error.message : String(error);
    return NextResponse.json(createResponse(false, errorMessage, null), {
      status: 500,
    });
  }
}
