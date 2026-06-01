import { TokenRoles } from "@/constants/UserRoles";
import { createResponse } from "@/utils/createResponse";
import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";
import { listAppointment } from "@/dentallyHelpers/appointment";
import { Appointment, TAppointment } from "@/types/appointment";
import { getPatient } from "@/dentallyHelpers/patient";

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
  console.log("in ednpoint ");
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
    const patientName = searchParams.get("patientName") || "";
    const [firstName, lastName] = patientName.split(" ");

    console.log("[/api/appointments/patient] patient id is ", patientName);
    if (!firstName || !lastName) {
      return NextResponse.json(
        createResponse(
          false,
          "Patient FirstName and LastName is required",
          null,
        ),
        { status: 400 },
      );
    }

    const response = await getPatient({
      firstName,
      lastName,
    });

    if (response.isError) {
      return NextResponse.json(
        createResponse(false, "Failed to get response from dentally", null),
        { status: 400 },
      );
    }

    const activePatients = (response.response.patients ?? []).filter(
      (patient: any) => patient.active && !patient.archivedReason,
    );

    if (activePatients.length === 0 || activePatients.length > 1) {
      return NextResponse.json(
        createResponse(false, "No Account found", null),
        { status: 404 },
      );
    }

    let active = activePatients[0];

    // Fetch appointments from Dentally using the patient_id filter
    const appointmentRes = await listAppointment({
      patientId: active.id,
      perPage: 100, // Get more appointments to show in the list
    });

    if (appointmentRes.isError) {
      return NextResponse.json(
        createResponse(
          false,
          "Failed to fetch appointments from Dentally",
          null,
        ),
        { status: 500 },
      );
    }

    const appointments = (appointmentRes.response.appointments ??
      []) as TAppointment[];

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
    }));

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
