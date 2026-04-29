import { TokenRoles } from "@/constants/UserRoles";
import prisma from "@/lib/db";
import { createResponse } from "@/utils/createResponse";
import { isValidCuid } from "@/utils/typeValidUtils";
import { ReferralRequestStatus } from "@prisma/client";
import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";

/**
 * @swagger
 * /api/olDAppointments/{id}:
 *   get:
 *     summary: Get an old appointment by ID
 *     tags: [Old Appointments]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Appointment ID (CUID)
 *     responses:
 *       200:
 *         description: Appointment fetched successfully
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               message: "Appointment fetched successfully."
 *               data:
 *                 id: "ckx1r2a3b0001s2v1b1b2c3d4"
 *                 practiceId: "ckx1r2a3b0002s2v1b1b2c3d4"
 *                 patientId: "ckx1r2a3b0003s2v1b1b2c3d4"
 *                 dentistId: "ckx1r2a3b0004s2v1b1b2c3d4"
 *                 reason: "Follow-up appointment"
 *                 state: "PENDING"
 *                 date: "2026-05-15T10:30:00.000Z"
 *                 startTime: "2026-05-15T10:30:00.000Z"
 *                 finishTime: "2026-05-15T11:00:00.000Z"
 *                 createdAt: "2026-04-29T10:00:00.000Z"
 *                 updatedAt: "2026-04-29T10:00:00.000Z"
 *                 dentist:
 *                   id: "ckx1r2a3b0004s2v1b1b2c3d4"
 *                   firstName: "Alex"
 *                   lastName: "Carter"
 *       400:
 *         description: Invalid Appointment
 *         content:
 *           application/json:
 *             example:
 *               status: false
 *               message: "Invalid Appointment."
 *               data: null
 *       403:
 *         description: You are forbidden to view this data
 *         content:
 *           application/json:
 *             example:
 *               status: false
 *               message: "You are forbidden to view this data"
 *               data: null
 *       404:
 *         description: Appointment does not exist
 *         content:
 *           application/json:
 *             example:
 *               status: false
 *               message: "Apppointmet does not exist."
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
 *     summary: Update an old appointment by ID
 *     tags: [Old Appointments]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Appointment ID (CUID)
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               practiceId:
 *                 type: string
 *               date:
 *                 type: string
 *                 format: date-time
 *               startTime:
 *                 type: string
 *                 format: date-time
 *               finishTime:
 *                 type: string
 *                 format: date-time
 *               patientId:
 *                 type: string
 *               dentistId:
 *                 type: string
 *               reason:
 *                 type: string
 *               state:
 *                 type: string
 *                 enum: [PENDING, CONFIRMED, CANCELLED, COMPLETED]
 *             example:
 *               reason: Follow-up appointment
 *               state: CONFIRMED
 *               date: '2026-05-15T10:30:00Z'
 *               startTime: '2026-05-15T10:30:00Z'
 *               finishTime: '2026-05-15T11:00:00Z'
 *     responses:
 *       200:
 *         description: Appointment updated successfully
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               message: "Appointment Updated successfully."
 *               data:
 *                 id: "ckx1r2a3b0001s2v1b1b2c3d4"
 *                 practiceId: "ckx1r2a3b0002s2v1b1b2c3d4"
 *                 patientId: "ckx1r2a3b0003s2v1b1b2c3d4"
 *                 dentistId: "ckx1r2a3b0004s2v1b1b2c3d4"
 *                 reason: "Follow-up appointment"
 *                 state: "CONFIRMED"
 *                 date: "2026-05-15T10:30:00.000Z"
 *                 startTime: "2026-05-15T10:30:00.000Z"
 *                 finishTime: "2026-05-15T11:00:00.000Z"
 *                 createdAt: "2026-04-29T10:00:00.000Z"
 *                 updatedAt: "2026-04-29T10:30:00.000Z"
 *       400:
 *         description: Invalid Appointment
 *         content:
 *           application/json:
 *             example:
 *               status: false
 *               message: "Invalid Appointment."
 *               data: null
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             example:
 *               status: false
 *               message: "Unauthorized"
 *               data: null
 *       403:
 *         description: You are not authorized to update this appointment
 *         content:
 *           application/json:
 *             example:
 *               status: false
 *               message: "You are not authorized to update this appointment."
 *               data: null
 *       404:
 *         description: Appointment does not exist
 *         content:
 *           application/json:
 *             example:
 *               status: false
 *               message: "Apppointmet does not exist."
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
 *     summary: Delete an old appointment by ID
 *     tags: [Old Appointments]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Appointment ID (CUID)
 *       - in: query
 *         name: patientId
 *         schema:
 *           type: string
 *         description: Patient ID used for delete authorization
 *     responses:
 *       200:
 *         description: Appointment deleted successfully
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               message: "Appointment deleted successfully."
 *               data: null
 *       400:
 *         description: Invalid Appointment
 *         content:
 *           application/json:
 *             example:
 *               status: false
 *               message: "Invalid Appointment."
 *               data: null
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             example:
 *               status: false
 *               message: "Unauthorized"
 *               data: null
 *       403:
 *         description: You are not authorized to delete this appointment
 *         content:
 *           application/json:
 *             example:
 *               status: false
 *               message: "You are not authorized to delete this appointment."
 *               data: null
 *       404:
 *         description: Appointment does not exist
 *         content:
 *           application/json:
 *             example:
 *               status: false
 *               message: "Apppointmet does not exist."
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
        },
      );
    }

    const appointmentId = req.nextUrl.pathname.split("/").pop();

    if (!appointmentId || !isValidCuid(appointmentId)) {
      return NextResponse.json(
        createResponse(false, "Invalid Appointment.", null),
        { status: 400 },
      );
    }

    const existingAppointment = await prisma.appointment.findUnique({
      where: { id: appointmentId },
    });

    if (!existingAppointment) {
      return NextResponse.json(
        createResponse(false, "Apppointmet does not exist.", null),
        { status: 404 },
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
        },
      );
    }

    const appoitnment = await prisma.appointment.findUnique({
      where: { id: appointmentId },
      include: { dentist: true },
    });

    return NextResponse.json(
      createResponse(true, "Appointment fetched successfully.", appoitnment),
      { status: 200 },
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
        },
      );
    }

    if (!appointmentId || !isValidCuid(appointmentId)) {
      return NextResponse.json(
        createResponse(false, "Invalid Appointment.", null),
        { status: 400 },
      );
    }

    const appointment = await prisma.appointment.findUnique({
      where: { id: appointmentId },
    });

    if (!appointment) {
      return NextResponse.json(
        createResponse(false, "Apppointmet does not exist.", null),
        { status: 404 },
      );
    }

    if (token.role !== TokenRoles.ADMIN) {
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
            "You are not authorized to update this appointment.",
            null,
          ),
          { status: 403 },
        );
      }
    }

    const updatedAppointment = await prisma.appointment.update({
      where: { id: appointmentId },
      data: partialAppointment,
    });

    if (updatedAppointment.state === "CANCELLED") {
      const referralRequest = await prisma.referralRequest.findUnique({
        where: { appointmentId: appointmentId },
      });

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
        updatedAppointment,
      ),
      { status: 200 },
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
        { status: 400 },
      );
    }

    const appointment = await prisma.appointment.findUnique({
      where: { id: appointmentId },
    });

    if (!appointment) {
      return NextResponse.json(
        createResponse(false, "Apppointmet does not exist.", null),
        { status: 404 },
      );
    }

    if (appointment.patientId !== patientId) {
      return NextResponse.json(
        createResponse(
          false,
          "You are not authorized to delete this appointment.",
          null,
        ),
        { status: 403 },
      );
    }

    await prisma.appointment.delete({
      where: { id: appointmentId },
    });

    return NextResponse.json(
      createResponse(true, "Appointment deleted successfully.", null),
      { status: 200 },
    );
  } catch (error) {
    console.log("Error in deleting appointment ", error);
    const errorMessage = error instanceof Error ? error.message : String(error);
    return NextResponse.json(createResponse(false, errorMessage, null), {
      status: 500,
    });
  }
}
