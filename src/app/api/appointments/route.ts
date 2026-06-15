import { TokenRoles } from "@/constants/UserRoles";
import { createResponse } from "@/utils/createResponse";
import prisma from "@/lib/db";
import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";
import { listAppointment } from "@/dentallyHelpers/appointment";
import {
  Appointment,
  AppointmentState,
  ListAppointment,
} from "@/types/appointment";

/**
 * @swagger
 * /api/appointments:
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

    if (token.role === TokenRoles.REFERRING_DENTIST) {
      return NextResponse.json(createResponse(false, "Forbidden", null), {
        status: 403,
      });
    }

    let patiendDentallyId = "";
    let dentistDentallyId = "";
    if (token && token.role === TokenRoles.PATIENT) {
      patiendDentallyId = token.sub || "";
    } else if (
      token &&
      token.role === TokenRoles.DENTALLY_PRACTITIONER
    ) {
      dentistDentallyId = token.sub || "";
    }

    const { searchParams } = new URL(req.url);
    const page = searchParams.get("page") || "1";
    const perPage = searchParams.get("per_page") || "20";
    const on = searchParams.get("on") || "";
    const before = searchParams.get("before") || "";
    const after = searchParams.get("after") || "";
    const state = searchParams.get("status") || "";

    const appointmentParams: ListAppointment = {
      page: Number(page),
      perPage: Number(perPage),
      ...(on && { on: new Date(on) }),
      ...(before && { before: new Date(before) }),
      ...(after && { after: new Date(after) }),
      ...(dentistDentallyId && { practitionerId: dentistDentallyId }),
      ...(patiendDentallyId && { patientId: patiendDentallyId }),
      ...(state && { state: state as AppointmentState }),
    };

  
    const response = await listAppointment(appointmentParams);
    if (response.isError) return response.response;
   

    const appointments = (response.response.appointments ?? []) as Appointment[];

    // Get all unique patient IDs from appointments
    const dentallyPatientIds = Array.from(new Set(
      appointments
        .map((apt) => apt.patientId)
        .filter((id): id is number => id !== undefined && id !== null)
    ));

    // Only query and update patients that exist in our database
    if (dentallyPatientIds.length) {
      const existingPatients = await prisma.patient.findMany({
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

      // Create a map of appointments by patient ID for easy lookup
      const appointmentIdsByPatientId = appointments.reduce(
        (acc, appointment) => {
          const patientId = appointment.patientId;
          if (patientId !== undefined && patientId !== null) {
            if (!acc[patientId]) {
              acc[patientId] = [];
            }
            acc[patientId].push(String(appointment.id));
          }
          return acc;
        },
        {} as Record<number, string[]>,
      );

      // Update only existing patients
      await Promise.all(
        existingPatients.map(async (patient) => {
          const incomingAppointmentIds =
            appointmentIdsByPatientId[patient.dentallyId] ?? [];
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

    // Get all unique practitioner IDs from appointments
    const dentallyPractitionerIds = Array.from(new Set(
      appointments
        .map((apt) => apt.practitionerId)
        .filter((id): id is number => id !== undefined && id !== null)
    ));

    // Only query and update dentists that exist in our database
    if (dentallyPractitionerIds.length) {
      const existingDentists = await prisma.dentist.findMany({
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

      // Create a map of appointments by practitioner ID for easy lookup
      const appointmentIdsByPractitionerId = appointments.reduce(
        (acc, appointment) => {
          const practitionerId = appointment.practitionerId;
          if (practitionerId !== undefined && practitionerId !== null) {
            if (!acc[practitionerId]) {
              acc[practitionerId] = [];
            }
            acc[practitionerId].push(String(appointment.id));
          }
          return acc;
        },
        {} as Record<number, string[]>,
      );

      // Update only existing dentists
      await Promise.all(
        existingDentists.map(async (dentist) => {
          const incomingAppointmentIds =
            appointmentIdsByPractitionerId[dentist.dentallyId ?? 0] ?? [];
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
      createResponse(true, "Appointments fetched successfully", response.response),
      { status: 200 },
    );
  } catch (error) {
    console.error("Error fetching appointments", error);
    const errorMessage = error instanceof Error ? error.message : String(error);
    return NextResponse.json(createResponse(false, errorMessage, null), {
      status: 500,
    });
  }
}
