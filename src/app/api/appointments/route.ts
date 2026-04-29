import { TokenRoles } from "@/constants/UserRoles";
import { createAppointment } from "@/dentallyHelpers/appointment";
import { createResponse } from "@/utils/createResponse";
import prisma from "@/lib/db";
import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";
import { AppointmentDateType } from "@/types/common";
import { listAppointment } from "@/dentallyHelpers/appointment";
import {
  Appointment,
  AppointmentState,
  ListAppointment,
} from "@/types/appointment";

/**
 * @swagger
 * /api/appointments:
 *   post:
 *     summary: Book an appointment
 *     tags: [Appointments]
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
 *     responses:
 *       201:
 *         description: Appointment Booked Successfully
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               message: "Appointment Booked Successfully"
 *               data:
 *                 id: "apt_01HXYZ1234ABCDE"
 *                 patientId: "pat_01HXYZ1234ABCDE"
 *                 practitionerwId: "prac_01HXYZ1234ABCDE"
 *                 siteId: "site_01HXYZ1234ABCDE"
 *                 state: "confirmed"
 *                 date: "2026-05-15T10:30:00.000Z"
 *                 startTime: "2026-05-15T10:30:00.000Z"
 *                 finishTime: "2026-05-15T11:00:00.000Z"
 *       500:
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             example:
 *               status: false
 *               message: "Internal Server Error"
 *               data: null
 *   get:
 *     summary: Get list of appointments
 *     tags: [Appointments]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: query
 *         name: on
 *         schema:
 *           type: string
 *           format: date
 *         description: Filter appointments on this date
 *       - in: query
 *         name: before
 *         schema:
 *           type: string
 *           format: date
 *         description: Filter appointments before this date
 *       - in: query
 *         name: after
 *         schema:
 *           type: string
 *           format: date
 *         description: Filter appointments after this date
 *       - in: query
 *         name: updated_after
 *         schema:
 *           type: string
 *           format: date
 *         description: Filter appointments updated after this date
 *       - in: query
 *         name: site_id
 *         schema:
 *           type: string
 *         description: Filter by site ID
 *       - in: query
 *         name: state
 *         schema:
 *           type: string
 *           enum: [pending, confirmed, cancelled, completed]
 *         description: Filter by appointment state
 *     responses:
 *       200:
 *         description: Appointments fetched successfully
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
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                       patientId:
 *                         type: string
 *                       practitionerwId:
 *                         type: string
 *                       siteId:
 *                         type: string
 *                       state:
 *                         type: string
 *             example:
 *               status: true
 *               message: "Appointments fetched successfully."
 *               data:
 *                 - id: "apt_01HXYZ1234ABCDE"
 *                   patientId: "pat_01HXYZ1234ABCDE"
 *                   practitionerwId: "prac_01HXYZ1234ABCDE"
 *                   siteId: "site_01HXYZ1234ABCDE"
 *                   state: "confirmed"
 *                   date: "2026-05-15T10:30:00.000Z"
 *                   startTime: "2026-05-15T10:30:00.000Z"
 *                   finishTime: "2026-05-15T11:00:00.000Z"
 *       403:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             example:
 *               status: false
 *               message: "Unauthorized"
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

export async function POST(req: NextRequest) {
  try {
    const appointment = await req.json();
    const createAppointmentResponse = await createAppointment(appointment);
    if (createAppointmentResponse.isError) {
      return createAppointmentResponse.response;
    }
    const newAppointment = createAppointmentResponse.response;
    return NextResponse.json(
      createResponse(true, "Appointment Booked Successfully", newAppointment),
      { status: 201 },
    );
  } catch (error) {
    console.error("Error fetching appointments", error);
    const errorMessage = error instanceof Error ? error.message : String(error);
    return NextResponse.json(createResponse(false, errorMessage, null), {
      status: 500,
    });
  }
}

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

    const { searchParams } = new URL(req.url);
    const on = searchParams.get("on") || "";
    const before = searchParams.get("before") || "";
    const after = searchParams.get("after") || "";
    const updatedAfter = searchParams.get("updated_after") || "";
    const siteId = searchParams.get("site_id") || "";
    const state = searchParams.get("state") || "";

    const appointmentParams: ListAppointment = {
      on: on ? new Date(on) : undefined,
      before: before ? new Date(before) : undefined,
      after: after ? new Date(after) : undefined,
      updatedAfter: updatedAfter ? new Date(updatedAfter) : undefined,
      practitionerId: dentistId || undefined,
      patientId: patiendId || undefined,
      siteId: siteId || undefined,
      state: state ? (state as AppointmentState) : undefined,
    };
    const response = await listAppointment(appointmentParams);
    if (response.isError) return response.response;

    let appointments: Appointment[] = [];
    appointments = response.response as Appointment[];

    const appointmentIdsByDentallyPatientId = appointments.reduce(
      (acc, appointment) => {
        const dentallyPatientId = String(appointment.patientId);

        if (!acc[dentallyPatientId]) {
          acc[dentallyPatientId] = [];
        }

        acc[dentallyPatientId].push(String(appointment.id));
        return acc;
      },
      {} as Record<string, string[]>,
    );

    const dentallyPatientIds = Object.keys(appointmentIdsByDentallyPatientId);

    if (dentallyPatientIds.length) {
      const patients = await prisma.patient.findMany({
        where: {
          dentallyId: {
            in: dentallyPatientIds,
          },
        },
        select: {
          id: true,
          dentallyId: true,
          appointmentIds: true,
        },
      });

      await Promise.all(
        patients.map(async (patient) => {
          const incomingAppointmentIds =
            appointmentIdsByDentallyPatientId[patient.dentallyId] ?? [];
          const mergedAppointmentIds = Array.from(
            new Set([
              ...(patient.appointmentIds ?? []),
              ...incomingAppointmentIds,
            ]),
          );

          await prisma.patient.update({
            where: { id: patient.id },
            data: { appointmentIds: mergedAppointmentIds },
          });
        }),
      );
    }

    const appointmentIdsByDentallyPractitionerId = appointments.reduce(
      (acc, appointment) => {
        const dentallyPractitionerId = String(appointment.practitionerwId);

        if (!acc[dentallyPractitionerId]) {
          acc[dentallyPractitionerId] = [];
        }

        acc[dentallyPractitionerId].push(String(appointment.id));
        return acc;
      },
      {} as Record<string, string[]>,
    );

    const dentallyPractitionerIds = Object.keys(
      appointmentIdsByDentallyPractitionerId,
    );

    if (dentallyPractitionerIds.length) {
      const dentists = await prisma.dentist.findMany({
        where: {
          dentallyId: {
            in: dentallyPractitionerIds,
          },
        },
        select: {
          id: true,
          dentallyId: true,
          appointmentIds: true,
        },
      });

      await Promise.all(
        dentists.map(async (dentist) => {
          const incomingAppointmentIds =
            appointmentIdsByDentallyPractitionerId[dentist.dentallyId] ?? [];
          const mergedAppointmentIds = Array.from(
            new Set([
              ...(dentist.appointmentIds ?? []),
              ...incomingAppointmentIds,
            ]),
          );

          await prisma.dentist.update({
            where: { id: dentist.id },
            data: { appointmentIds: mergedAppointmentIds },
          });
        }),
      );
    }

    return NextResponse.json(
      createResponse(true, "Appointments fetched successfully", appointments),
      { status: 200 },
    );

    // const page = parseInt(searchParams.get("page") || "1", 10);

    // const search = searchParams.get("search") || "";
    // const statusParam = searchParams.get("status") || "";
  } catch (error) {
    console.error("Error fetching appointments", error);
    const errorMessage = error instanceof Error ? error.message : String(error);
    return NextResponse.json(createResponse(false, errorMessage, null), {
      status: 500,
    });
  }
}
