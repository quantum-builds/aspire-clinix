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
 *             example:
 *               status: true
 *               message: "Appointment fetched successfully"
 *               data:
 *                 appointment:
 *                   id: "apt_01HXYZ1234ABCDE"
 *                   patientId: "pat_01HXYZ1234ABCDE"
 *                   practitionerwId: "prac_01HXYZ1234ABCDE"
 *                   siteId: "site_01HXYZ1234ABCDE"
 *                   state: "confirmed"
 *                 reports:
 *                   videos:
 *                     - id: "rep_01HXYZ1234ABCDE"
 *                       title: "Post-op Video"
 *                       fileUrl: "https://example.com/reports/post-op.mp4"
 *                       fileType: "VIDEO"
 *                   pdfs:
 *                     - id: "rep_01HXYZ1234ABCDF"
 *                       title: "Treatment Summary"
 *                       fileUrl: "https://example.com/reports/summary.pdf"
 *                       fileType: "PDF"
 *       400:
 *         description: Invalid Appointment ID
 *         content:
 *           application/json:
 *             example:
 *               status: false
 *               message: "Invalid Appointment."
 *               data: null
 *       403:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             example:
 *               status: false
 *               message: "Unauthorized"
 *               data: null
 *       404:
 *         description: Appointment not found
 *         content:
 *           application/json:
 *             example:
 *               status: false
 *               message: "Appointment not found for the user."
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
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               message: "Appointment deleted successfully"
 *               data: null
 *       400:
 *         description: Invalid Appointment ID
 *         content:
 *           application/json:
 *             example:
 *               status: false
 *               message: "Invalid Appointment."
 *               data: null
 *       403:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             example:
 *               status: false
 *               message: "Unauthorized"
 *               data: null
 *       404:
 *         description: Appointment not found
 *         content:
 *           application/json:
 *             example:
 *               status: false
 *               message: "Failed to delete appointment"
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
 *             example:
 *               status: true
 *               message: "Appointment updated successfully"
 *               data:
 *                 id: "apt_01HXYZ1234ABCDE"
 *                 patientId: "pat_01HXYZ1234ABCDE"
 *                 practitionerwId: "prac_01HXYZ1234ABCDE"
 *                 siteId: "site_01HXYZ1234ABCDE"
 *                 state: "confirmed"
 *                 date: "2026-05-15T10:30:00.000Z"
 *       400:
 *         description: Invalid Appointment ID or no data provided
 *         content:
 *           application/json:
 *             example:
 *               status: false
 *               message: "No appointment data provided."
 *               data: null
 *       403:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             example:
 *               status: false
 *               message: "Unauthorized"
 *               data: null
 *       404:
 *         description: Appointment not found
 *         content:
 *           application/json:
 *             example:
 *               status: false
 *               message: "Appointment not found for the user."
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
    const token = await getToken({
      req,
    });

    if (!token) {
      return NextResponse.json(createResponse(false, "Unauthorized", null), {
        status: 401,
      });
    }

    // if (token.role === TokenRoles.REFERRING_DENTIST) {
    //   return NextResponse.json(createResponse(false, "Forbidden", null), {
    //     status: 403,
    //   });
    // }

    let patiendDentallyId = "";
    let dentistDentallyId = "";
    if (token && token.role === TokenRoles.PATIENT) {
      patiendDentallyId = token.sub || "";
    } else if (token && token.role === TokenRoles.DENTALLY_PRACTITIONER) {
      dentistDentallyId = token.sub || "";
    }

    const appointmentId = req.nextUrl.pathname.split("/").pop();

    if (!appointmentId) {
      return NextResponse.json(
        createResponse(false, "Invalid Appointment.", null),
        { status: 400 },
      );
    }
    const response = await getAppointment(appointmentId);

    if (response.isError) {
      return response.response;
    }

    const appointment = (response.response.appointment ?? null) as Appointment;

    if (!appointment) {
      return NextResponse.json(
        createResponse(false, "No appointment found.", null),
        { status: 404 },
      );
    }

    let appointmentOwner = null;

    if (patiendDentallyId) {
      appointmentOwner = await prisma.patient.findUnique({
        where: { dentallyId: Number(patiendDentallyId) },
        select: { id: true, appointmentIds: true },
      });
    } else if (dentistDentallyId) {
      appointmentOwner = await prisma.dentist.findFirst({
        where: { dentallyId: Number(dentistDentallyId) },
        select: { id: true, appointmentIds: true },
      });
    } else {
      // let me check for the dentist as he will absolutely be in the db as he is the one uploading the report
      appointmentOwner = await prisma.dentist.findFirst({
        where: { dentallyId: appointment.practitionerId },
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

    const [patient, videos, pdfs] = await Promise.all([
      await prisma.patient.findUnique({
        where: { dentallyId: appointment.patientId },
      }),
      await prisma.report.findMany({
        where: { appointmentId, fileType: "VIDEO" },
        orderBy: { createdAt: "desc" },
        include: { dentist: true },
      }),
      await prisma.report.findMany({
        where: { appointmentId, fileType: "PDF" },
        orderBy: { createdAt: "desc" },
        include: { dentist: true },
      }),
    ]);

    if (!videos.length && !pdfs.length) {
      return NextResponse.json(
        createResponse(true, "No reports found.", {
          appointment,
          reports: { videos: [], pdfs: [] },
          patient,
        }),
        { status: 200 },
      );
    }

    return NextResponse.json(
      createResponse(true, "Appointment fetched successfully", {
        appointment,
        reports: { videos, pdfs },
        patient,
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

    if (!token) {
      return NextResponse.json(createResponse(false, "Unauthorized", null), {
        status: 401,
      });
    }

    if (token.role === TokenRoles.REFERRING_DENTIST) {
      return NextResponse.json(createResponse(false, "Forbidden", null), {
        status: 403,
      });
    }

    let patiendDentallyId = "";
    let dentistDentallyId = "";

    if (token && token.role === TokenRoles.PATIENT) {
      patiendDentallyId = token.sub || "";
    } else if (token && token.role === TokenRoles.DENTALLY_PRACTITIONER) {
      dentistDentallyId = token.sub || "";
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
        createResponse(false, "Failed to get response from dentally", null),
        { status: 400 },
      );
    }

    let appointment = null;

    if (patiendDentallyId) {
      appointment = await prisma.patient.findUnique({
        where: { dentallyId: Number(patiendDentallyId) },
        select: { id: true, appointmentIds: true },
      });
    }
    if (dentistDentallyId) {
      appointment = await prisma.patient.findFirst({
        where: { dentallyId: Number(dentistDentallyId) },
        select: { id: true, appointmentIds: true },
      });
    }

    const currentAppointmentIds: string[] = Array.isArray(
      appointment?.appointmentIds,
    )
      ? (appointment.appointmentIds as string[])
      : [];

    if (appointment && currentAppointmentIds.includes(appointmentId)) {
      if (patiendDentallyId) {
        await prisma.patient.update({
          where: { id: appointment.id },
          data: {
            appointmentIds: currentAppointmentIds.filter(
              (id: string) => id !== appointmentId,
            ),
          },
        });
      } else if (dentistDentallyId) {
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

    if (!token) {
      return NextResponse.json(createResponse(false, "Unauthorized", null), {
        status: 401,
      });
    }

    if (token.role === TokenRoles.REFERRING_DENTIST) {
      return NextResponse.json(createResponse(false, "Forbidden", null), {
        status: 403,
      });
    }

    let patiendDentallyId = "";
    let dentistDentallyId = "";

    if (token && token.role === TokenRoles.PATIENT) {
      patiendDentallyId = token.sub || "";
    } else if (token && token.role === TokenRoles.DENTALLY_PRACTITIONER) {
      dentistDentallyId = token.sub || "";
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

    if (patiendDentallyId) {
      appointmentOwner = await prisma.patient.findUnique({
        where: { dentallyId: Number(patiendDentallyId) },
        select: { id: true, appointmentIds: true },
      });
    }
    if (dentistDentallyId) {
      appointmentOwner = await prisma.dentist.findFirst({
        where: { dentallyId: Number(dentistDentallyId) },
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
    console.error("Error editing appointment", JSON.stringify(error as any));
    const errorMessage = error instanceof Error ? error.message : String(error);
    return NextResponse.json(createResponse(false, errorMessage, null), {
      status: 500,
    });
  }
}
