import { TokenRoles } from "@/constants/UserRoles";
import {
  editAppointment,
  deleteAppointment,
  getAppointment,
} from "@/dentallyHelpers/appointment";
import { createResponse } from "@/utils/createResponse";
import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";
import { Appointment } from "@/types/appointment";
import { isValidCuid } from "@/utils/typeValidUtils";
import prisma from "@/lib/db";


/**
 * @swagger
 * /api/appointments/{id}:
 *   get:
 *     summary: Get a single appointment by ID
 *     tags: [Appointments]
 *     security:
 *       - BearerAuth: []
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
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 data:
 *                   type: object
 *                   properties:
 *                     appointment:
 *                       type: object
 *                       properties:
 *                         id:
 *                           type: string
 *                         patientId:
 *                           type: string
 *                         practitionerwId:
 *                           type: string
 *                         siteId:
 *                           type: string
 *                         state:
 *                           type: string
 *                     reports:
 *                       type: object
 *                       properties:
 *                         videos:
 *                           type: array
 *                           items:
 *                             type: object
 *                         pdfs:
 *                           type: array
 *                           items:
 *                             type: object
 *       400:
 *         description: Invalid Appointment ID
 *       403:
 *         description: Unauthorized
 *       404:
 *         description: Appointment not found
 *       500:
 *         description: Internal Server Error
 *   delete:
 *     summary: Delete an appointment by ID
 *     tags: [Appointments]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Appointment ID to delete
 *     responses:
 *       204:
 *         description: Appointment deleted successfully
 *       400:
 *         description: Invalid Appointment ID
 *       403:
 *         description: Unauthorized
 *       404:
 *         description: Appointment not found
 *       500:
 *         description: Internal Server Error
 *   patch:
 *     summary: Update an appointment by ID
 *     tags: [Appointments]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Appointment ID to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               patientId:
 *                 type: string
 *               practitionerId:
 *                 type: string
 *               siteId:
 *                 type: string
 *               date:
 *                 type: string
 *                 format: date-time
 *               state:
 *                 type: string
 *                 enum: [pending, confirmed, cancelled, completed]
 *     responses:
 *       200:
 *         description: Appointment updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 data:
 *                   type: object
 *       400:
 *         description: Invalid Appointment ID or no data provided
 *       403:
 *         description: Unauthorized
 *       404:
 *         description: Appointment not found
 *       500:
 *         description: Internal Server Error
 */


export async function GET(req: NextRequest) {
  try {
    const token = await getToken({
      req,
    });

    if (token && token.role === TokenRoles.REFERRING_DENTIST) {
      return NextResponse.json(createResponse(false, "Unauthorized", null), {
        status: 403,
      });
    }
    let patiendId = "";
    let dentistId = "";
    if (token && token.role === TokenRoles.PATIENT) {
      patiendId = token.sub || "";
    } else if (
      token &&
      (token.role == TokenRoles.DENTIST ||
        token.role === TokenRoles.RECIEVING_DENTIST)
    ) {
      dentistId = token.sub || "";
    }

    const appointmentId = req.nextUrl.pathname.split("/").pop();

    if (!appointmentId || !isValidCuid(appointmentId)) {
      return NextResponse.json(
        createResponse(false, "Invalid Appointment.", null),
        { status: 400 },
      );
    }
    let appointmentOwner = null;

    if (patiendId) {
      appointmentOwner = await prisma.patient.findUnique({
        where: { id: patiendId },
        select: { id: true, appointmentIds: true },
      });
    }
    if (dentistId) {
      appointmentOwner = await prisma.dentist.findUnique({
        where: { id: dentistId },
        select: { id: true, appointmentIds: true },
      });
    }

    const currentAppointmentIds: string[] = Array.isArray(
      appointmentOwner?.appointmentIds,
    )
      ? (appointmentOwner.appointmentIds as string[])
      : [];

    const isExist = currentAppointmentIds.includes(appointmentId);

    if (!isExist) {
      return NextResponse.json(
        createResponse(false, "Appointment not found for the user.", null),
        { status: 404 },
      );
    }

    const response = await getAppointment(appointmentId);

    let appointment: Appointment | null = null;
    appointment = response.response as Appointment;

    if (!appointment) {
      return NextResponse.json(
        createResponse(false, "No appointment found.", null),
        { status: 404 },
      );
    } // fetch videos

    const videos = await prisma.report.findMany({
      where: { appointmentId, fileType: "VIDEO" },
      orderBy: { createdAt: "desc" },
      include: { dentist: true },
    }); // fetch pdfs

    const pdfs = await prisma.report.findMany({
      where: { appointmentId, fileType: "PDF" },
      orderBy: { createdAt: "desc" },
      include: { dentist: true },
    });

    if (!videos.length && !pdfs.length) {
      return NextResponse.json(
        createResponse(false, "No reports found.", null),
        { status: 404 },
      );
    }

    return NextResponse.json(
      createResponse(true, "Appointment fetched successfully", {
        appointment,
        reports: { videos, pdfs },
      }),
      { status: 200 },
    );
  } catch (error) {
    console.error("Error fetching appointment", error);
    const errorMessage = error instanceof Error ? error.message : String(error);
    return NextResponse.json(createResponse(false, errorMessage, null), {
      status: 500,
    });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const token = await getToken({
      req,
    });
    if (token && token.role === TokenRoles.REFERRING_DENTIST) {
      return NextResponse.json(createResponse(false, "Unauthorized", null), {
        status: 403,
      });
    }

    let patiendId = "";
    let dentistId = "";

    if (token && token.role === TokenRoles.PATIENT) {
      patiendId = token.sub || "";
    } else if (
      token &&
      (token.role == TokenRoles.DENTIST ||
        token.role === TokenRoles.RECIEVING_DENTIST)
    ) {
      dentistId = token.sub || "";
    }

    const appointmentId = req.nextUrl.pathname.split("/").pop();

    if (!appointmentId) {
      return NextResponse.json(
        createResponse(false, "Invalid Appointment.", null),
        { status: 400 },
      );
    }

    const response = await deleteAppointment(appointmentId);
    if (response.isError) {
      return NextResponse.json(
        createResponse(false, "Failed to delete appointment", null),
        { status: 404 },
      );
    }

    let appointment = null;

    if (patiendId) {
      appointment = await prisma.patient.findUnique({
        where: { id: patiendId },
        select: { id: true, appointmentIds: true },
      });
    }
    if (dentistId) {
      appointment = await prisma.patient.findUnique({
        where: { id: dentistId },
        select: { id: true, appointmentIds: true },
      });
    }

    const currentAppointmentIds: string[] = Array.isArray(
      appointment?.appointmentIds,
    )
      ? (appointment.appointmentIds as string[])
      : [];

    if (appointment && currentAppointmentIds.includes(appointmentId)) {
      if (patiendId) {
        await prisma.patient.update({
          where: { id: appointment.id },
          data: {
            appointmentIds: currentAppointmentIds.filter(
              (id: string) => id !== appointmentId,
            ),
          },
        });
      } else if (dentistId) {
        await prisma.dentist.update({
          where: { id: appointment.id },
          data: {
            appointmentIds: currentAppointmentIds.filter(
              (id: string) => id !== appointmentId,
            ),
          },
        });
      }
    }

    return NextResponse.json(
      createResponse(true, "Appointment deleted successfully", null),
      { status: 204 },
    );
  } catch (error) {
    console.error("Error deleting appointment", error);
    const errorMessage = error instanceof Error ? error.message : String(error);
    return NextResponse.json(createResponse(false, errorMessage, null), {
      status: 500,
    });
  }
}
export async function PATCH(req: NextRequest) {
  try {
    const partialAppointment = await req.json();
    const token = await getToken({
      req,
    });

    if (token && token.role === TokenRoles.REFERRING_DENTIST) {
      return NextResponse.json(createResponse(false, "Unauthorized", null), {
        status: 403,
      });
    }

    let patiendId = "";
    let dentistId = "";

    if (token && token.role === TokenRoles.PATIENT) {
      patiendId = token.sub || "";
    } else if (
      token &&
      (token.role == TokenRoles.DENTIST ||
        token.role === TokenRoles.RECIEVING_DENTIST)
    ) {
      dentistId = token.sub || "";
    }

    const appointmentId = req.nextUrl.pathname.split("/").pop();

    if (!appointmentId) {
      return NextResponse.json(
        createResponse(false, "Invalid Appointment.", null),
        { status: 400 },
      );
    }

    if (!partialAppointment || Object.keys(partialAppointment).length === 0) {
      return NextResponse.json(
        createResponse(false, "No appointment data provided.", null),
        { status: 400 },
      );
    }
    let appointmentOwner = null;

    if (patiendId) {
      appointmentOwner = await prisma.patient.findUnique({
        where: { id: patiendId },
        select: { id: true, appointmentIds: true },
      });
    }
    if (dentistId) {
      appointmentOwner = await prisma.dentist.findUnique({
        where: { id: dentistId },
        select: { id: true, appointmentIds: true },
      });
    }

    const currentAppointmentIds: string[] = Array.isArray(
      appointmentOwner?.appointmentIds,
    )
      ? (appointmentOwner.appointmentIds as string[])
      : [];

    const isExist = currentAppointmentIds.includes(appointmentId);

    if (!isExist) {
      return NextResponse.json(
        createResponse(false, "Appointment not found for the user.", null),
        { status: 404 },
      );
    }

    const response = await editAppointment(appointmentId, partialAppointment);

    return NextResponse.json(
      createResponse(
        true,
        "Appointment updated successfully",
        response.response,
      ),
      { status: 200 },
    );
  } catch (error) {
    console.error("Error editing appointment", error);
    const errorMessage = error instanceof Error ? error.message : String(error);
    return NextResponse.json(createResponse(false, errorMessage, null), {
      status: 500,
    });
  }
}
