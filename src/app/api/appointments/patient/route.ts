import { TokenRoles } from "@/constants/UserRoles";
import { createResponse } from "@/utils/createResponse";
import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";
import { listAppointment } from "@/dentallyHelpers/appointment";
import { Appointment, TAppointment } from "@/types/appointment";
import prisma from "@/lib/db";

/**
 * @swagger
 * /api/appointments/patient/{patientId}:
 *   get:
 *     summary: Get appointments for a specific patient
 *     tags: [Appointments]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: patientId
 *         required: true
 *         schema:
 *           type: string
 *         description: Patient ID (Dentally patient ID)
 *     responses:
 *       200:
 *         description: Appointments fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: number
 *                       patientId:
 *                         type: number
 *                       patientName:
 *                         type: string
 *                       practitionerName:
 *                         type: string
 *                       startTime:
 *                         type: string
 *                       finishTime:
 *                         type: string
 *                       duration:
 *                         type: number
 *                       reason:
 *                         type: string
 *                       state:
 *                         type: string
 *             example:
 *               status: true
 *               message: "Appointments fetched successfully."
 *               data:
 *                 - id: 937446394
 *                   patientId: 81
 *                   patientName: "John Doe"
 *                   practitionerName: "Dr. Smith"
 *                   startTime: "2026-05-06T08:35:00.000+01:00"
 *                   finishTime: "2026-05-06T08:40:00.000+01:00"
 *                   duration: 5
 *                   reason: "Exam"
 *                   state: "Pending"
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       500:
 *         description: Internal Server Error
 */
export async function GET(req: NextRequest) {

  try {
    const token = await getToken({ req });

    if (!token) {
      return NextResponse.json(createResponse(false, "Unauthorized", null), {
        status: 401,
      });
    }

    // Only admin and clinic staff can access patient appointments
    if (token.role !== TokenRoles.ADMIN) {
      return NextResponse.json(createResponse(false, "Forbidden", null), {
        status: 403,
      });
    }
    const { searchParams } = new URL(req.url);
    // The Dentally patient the admin picked from the similar-patients list
    // (GET /api/appointments/patient/matches).
    const dentallyPatientId = Number(searchParams.get("dentallyPatientId"));
    // Optional: restrict results to the referral's assigned dentist (Dentally practitioner id)
    const practitionerId = searchParams.get("practitionerId") || undefined;

    if (!Number.isInteger(dentallyPatientId) || dentallyPatientId <= 0) {
      return NextResponse.json(
        createResponse(false, "dentallyPatientId is required", null),
        { status: 400 }
      );
    }

    // Fetch appointments from Dentally using the patient_id filter
    const appointmentRes = await listAppointment({
      patientId: String(dentallyPatientId),
      perPage: 100, // Get more appointments to show in the list
      practitionerId,
    });

    if (appointmentRes.isError) {
      return NextResponse.json(
        createResponse(false, "Failed to fetch appointments from Dentally", null),
        { status: 500 }
      );
    }

    const appointments = (
      (appointmentRes.response.appointments ?? []) as TAppointment[]
    ).filter(
      (apt) => !practitionerId || String(apt.practitionerId) === practitionerId,
    );
    const appointmentIds = appointments.map((a) => String(a.id));

    const referralBindings = await prisma.referralRequest.findMany({
      where: {
        appointmentId: {
          in: appointmentIds,
        },
      },
      select: {
        appointmentId: true,
      },
    });
    const boundAppointmentSet = new Set(
      referralBindings.map((r) => String(r.appointmentId)),
    );

    // Format appointments for the response
    const formattedAppointments = appointments.map((apt) => ({
      id: apt.id,
      patientId: apt.patientId,
      patientName: apt.patientName,
      practitionerName: apt.practitionerName,
      practitionerId: apt.practitionerId,
      startTime: apt.startTime,
      finishTime: apt.finishTime,
      duration: apt.duration,
      reason: apt.reason,
      state: apt.state,
      bindStatus: boundAppointmentSet.has(String(apt.id))
    ? "BOUND"
    : "UNBOUND"
    }));

    console.log("[/api/appointments/patient] formattedAppointments", formattedAppointments);

    return NextResponse.json(
      createResponse(
        true,
        "Appointments fetched successfully",
        formattedAppointments,
      ),
      { status: 200 },
    );
  } catch (error) {
    console.error("Error fetching patient appointments:", error);
    const errorMessage = error instanceof Error ? error.message : String(error);
    return NextResponse.json(createResponse(false, errorMessage, null), {
      status: 500,
    });
  }
}
