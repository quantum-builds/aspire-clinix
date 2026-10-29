import { TokenRoles } from "@/constants/UserRoles";
import {
  editAppointment,
  getAppointment,
} from "@/dentallyHelpers/appointment";
import { createResponse } from "@/utils/createResponse";
import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";
import { Appointment, AppointmentState } from "@/types/appointment";
import prisma from "@/lib/db";
import { getPatientById } from "@/dentallyHelpers/patient";
import { notifyAppointmentStatus } from "@/notifications/appointmentNotifications";
import {
  notifySessionCompleted,
  notifyWellnessCompleted,
} from "@/notifications/wellnessNotifications";
import { isValidCuid } from "@/utils/typeValidUtils";
import {
  sessionToAppointment,
  stateToSessionStatus,
  TreatmentSlotException,
} from "@/lib/treatment-session";
import { cancelTreatmentSession } from "@/lib/session-cancellation";
import { refundCancelledDentallyAppointment } from "@/lib/stripe/refunds";
import {
  canPatientCancel,
  LATE_CANCEL_MESSAGE,
} from "@/utils/cancellationPolicy";

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

    let patiendDentallyId = "";
    let dentistDentallyId = "";
    let isAdmin = false;
    if (token && token.role === TokenRoles.PATIENT) {
      patiendDentallyId = token.sub || "";
    } else if (token && token.role === TokenRoles.DENTALLY_PRACTITIONER) {
      dentistDentallyId = token.sub || "";
    } else if (token?.role === TokenRoles.ADMIN) {
      isAdmin = true;
    }

    const appointmentId = req.nextUrl.pathname.split("/").pop();

    if (!appointmentId) {
      return NextResponse.json(
        createResponse(false, "Invalid Appointment.", null),
        { status: 400 },
      );
    }
    if (isValidCuid(appointmentId)) {
      const session = await prisma.session.findUnique({
        where: { id: appointmentId },
        include: { treatment: true },
      });

      const canView =
        session &&
        (isAdmin ||
          (patiendDentallyId &&
            session.patientId === Number(patiendDentallyId)) ||
          (dentistDentallyId &&
            session.practitionerId === Number(dentistDentallyId)));

      if (!session || !canView) {
        return NextResponse.json(
          createResponse(false, "Appointment not found for the user.", null),
          { status: 404 },
        );
      }

      const sessionRecipientWhere =
        token.role === TokenRoles.PATIENT
          ? { recipientType: "PATIENT" as const }
          : {};

      const [patient, videos, pdfs] = await Promise.all([
        prisma.patient.findUnique({
          where: { dentallyId: session.patientId },
        }),
        prisma.report.findMany({
          where: {
            sessionId: session.id,
            fileType: "VIDEO",
            ...sessionRecipientWhere,
          },
          orderBy: { createdAt: "desc" },
          include: { dentist: true },
        }),
        prisma.report.findMany({
          where: {
            sessionId: session.id,
            fileType: "PDF",
            ...sessionRecipientWhere,
          },
          orderBy: { createdAt: "desc" },
          include: { dentist: true },
        }),
      ]);

      return NextResponse.json(
        createResponse(true, "Appointment fetched successfully.", {
          appointment: sessionToAppointment(session),
          reports: { videos, pdfs },
          patient,
        }),
        { status: 200 },
      );
    }

    const response = await getAppointment(appointmentId);
    console.log("Response from getAppointment:", response);

    if (response.isError) {
      return response.response;
    }

    const appointment = (response.response.appointment ?? null) as Appointment;
    console.log("Fetched appointment:", appointment);

    if (!appointment) {
      return NextResponse.json(
        createResponse(false, "No appointment found.", null),
        { status: 404 },
      );
    }

    let appointmentOwner = null;

    if (isAdmin) {
      appointmentOwner = null;
    } else if (patiendDentallyId) {
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

    const isExist = isAdmin || currentAppointmentIds.includes(appointmentId);

    if (!isExist) {
      return NextResponse.json(
        createResponse(false, "Appointment not found for the user.", null),
        { status: 404 },
      );
    }

    console.log("Token role in the get appointement api:", token.role);

    const recipientWhere: Record<string, any> = {};
    if (token?.role === TokenRoles.PATIENT) {
      recipientWhere.recipientType = "PATIENT";
    } else if (token?.role === TokenRoles.REFERRING_DENTIST) {
      recipientWhere.recipientType = "REFERRING_DENTIST";
    }

    console.log("Appointment ID:", appointmentId);
    console.log("Appointment:", appointment);
    console.log("Patient ID:", appointment.patientId);

    const [patient, videos, pdfs] = await Promise.all([
      await prisma.patient.findUnique({
        where: { dentallyId: appointment.patientId },
      }),
      await prisma.report.findMany({
        where: { appointmentId, fileType: "VIDEO", ...recipientWhere },
        orderBy: { createdAt: "desc" },
        include: { dentist: true },
      }),
      await prisma.report.findMany({
        where: { appointmentId, fileType: "PDF", ...recipientWhere },
        orderBy: { createdAt: "desc" },
        include: { dentist: true },
      }),
    ]);

    if (!patient) {
      const patient = await getPatientById(String(appointment.patientId));

      if (patient.isError) {
        return patient.response;
      }
      let activePatients = (response.response.patients ?? []).filter(
        (patient: any) => patient.active && !patient.archivedReason,
      );

      if (activePatients.length > 0) {
        return NextResponse.json(
          createResponse(false, "Patient not found.", null),
          { status: 404 },
        );
      }

      const dbpatient = await prisma.patient.findFirst({
        where: { dentallyId: Number(appointment.patientId) },
      });

      

      const patientData = patient.response.patient;
      const name = `${patientData.firstName} ${patientData.lastName}`.trim();

      if (!dbpatient) {
        await prisma.patient.create({
          data: {
            uuid: patientData.uuid,
            dentallyId: Number(patientData.id),
            name,
            email: patientData.emailAddress ?? "",
            mobileNumber: patientData.mobilePhone ?? "",
            dateOfBirth: patientData.dateOfBirth ?? "",
          },
        });
      } else {
        await prisma.patient.update({
          where: {
            dentallyId: Number(patientData.id),
          },
          data: {
            name,
            email: patientData.emailAddress,
            mobileNumber: patientData.mobilePhone,
            dateOfBirth: patientData.dateOfBirth,
            uuid: patientData.uuid,
          },
        });
      }
    }

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

// No DELETE handler: appointments are cancelled through PATCH (state
// "Cancelled") so the Dentally webhook can refund or restore credits. See
// REFUND_PLAN.md D5/D6.

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

    // Admin-managed sessions (Breathwork, ...) live only in our DB, so their
    // status is updated here rather than in Dentally.
    if (isValidCuid(appointmentId)) {
      const session = await prisma.session.findUnique({
        where: { id: appointmentId },
        include: { treatment: true },
      });

      const isPractitioner =
        !!session &&
        !!dentistDentallyId &&
        session.practitionerId === Number(dentistDentallyId);
      const isPatientOwner =
        !!session &&
        !!patiendDentallyId &&
        session.patientId === Number(patiendDentallyId);
      // The admin (clinic dashboard) manages every session, like its
      // practitioner does.
      const isClinic = isPractitioner || token.role === TokenRoles.ADMIN;

      if (!session || !(isClinic || isPatientOwner)) {
        return NextResponse.json(
          createResponse(false, "Appointment not found for the user.", null),
          { status: 404 },
        );
      }

      const newStatus = stateToSessionStatus(partialAppointment.state);

      if (!newStatus) {
        return NextResponse.json(
          createResponse(false, "Invalid appointment status.", null),
          { status: 400 },
        );
      }

      // Patients may only cancel their own session, within 24 h of booking
      // and before it starts. The practitioner or admin may cancel at any time
      // (REFUND_PLAN.md R2/R3).
      if (!isClinic) {
        if (newStatus !== "CANCELLED") {
          return NextResponse.json(
            createResponse(false, "Forbidden", null),
            { status: 403 },
          );
        }

        if (!canPatientCancel(sessionToAppointment(session))) {
          return NextResponse.json(
            createResponse(false, LATE_CANCEL_MESSAGE, null),
            { status: 400 },
          );
        }
      }

      if (newStatus === "CANCELLED") {
        try {
          const result = await cancelTreatmentSession(
            session,
            isClinic ? "CLINIC" : "PATIENT",
          );
          console.log(`Session ${session.id} cancel:`, result);
        } catch (error) {
          if (
            error instanceof TreatmentSlotException &&
            error.code === "SLOT_CONFLICT"
          ) {
            return NextResponse.json(
              createResponse(false, "Please try again.", null),
              { status: 409 },
            );
          }
          throw error;
        }
      } else {
        // Only the request that actually moves the session to COMPLETED
        // sends the post email, so repeated clicks do not send it twice.
        const updated = await prisma.session.updateMany({
          where: { id: session.id, status: { not: newStatus } },
          data: { status: newStatus },
        });

        if (updated.count === 1 && newStatus === "COMPLETED") {
          notifySessionCompleted(session).catch(console.error);
        }
      }

      const fresh = await prisma.session.findUniqueOrThrow({
        where: { id: session.id },
        include: { treatment: true },
      });

      return NextResponse.json(
        createResponse(
          true,
          "Appointment updated successfully",
          sessionToAppointment(fresh),
        ),
        { status: 200 },
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

    const isCancel = partialAppointment.state === AppointmentState.CANCELLED;

    // A paid booking belongs to the patient who paid, even before the
    // appointments list has added it to appointmentIds.
    const isExist =
      currentAppointmentIds.includes(appointmentId) ||
      (!!patiendDentallyId &&
        (await prisma.appointmentPayment.count({
          where: {
            dentallyAppointmentId: appointmentId,
            patientDentallyId: Number(patiendDentallyId),
          },
        })) > 0);

    if (!isExist) {
      return NextResponse.json(
        createResponse(false, "Appointment not found for the user.", null),
        { status: 404 },
      );
    }

    // Patients can cancel only within 24 h of booking and before the start
    // (REFUND_PLAN.md R2). Checked against Dentally's created_at and
    // start_time, not anything the client sent.
    if (isCancel && patiendDentallyId) {
      const current = await getAppointment(appointmentId);
      const currentAppointment = current.isError
        ? null
        : ((current.response.appointment ?? null) as Appointment | null);

      if (!currentAppointment) {
        return NextResponse.json(
          createResponse(false, "Appointment not found.", null),
          { status: 404 },
        );
      }

      if (!canPatientCancel(currentAppointment)) {
        return NextResponse.json(
          createResponse(false, LATE_CANCEL_MESSAGE, null),
          { status: 400 },
        );
      }
    }

    // Stamped before the Dentally call so the webhook sees who cancelled.
    if (isCancel) {
      await prisma.appointmentPayment.updateMany({
        where: { dentallyAppointmentId: appointmentId },
        data: { cancelledBy: patiendDentallyId ? "PATIENT" : "CLINIC" },
      });
    }

    const response = await editAppointment(appointmentId, partialAppointment);

    // The Dentally webhook refunds too; doing it here as well means an in-app
    // cancel is refunded even if that webhook is late or not delivered. The
    // refund helper makes the second attempt a no-op.
    if (isCancel && !response.isError) {
      const cancelled = (response.response.appointment ?? null) as
        | Appointment
        | null;

      await refundCancelledDentallyAppointment(appointmentId, {
        reason: cancelled?.reason,
        startTime: cancelled?.startTime,
      }).catch((error) =>
        console.error(
          `Refund after cancelling ${appointmentId} failed; the Dentally webhook will retry:`,
          error,
        ),
      );
    }

    const status = partialAppointment.state;
    if (status === "Confirmed" || status === "Cancelled") {
      notifyAppointmentStatus(appointmentId, status).catch(console.error);
    }
    if (status === AppointmentState.COMPLETED && !response.isError) {
      notifyWellnessCompleted(
        appointmentId,
        response.response.appointment ?? null,
      ).catch(console.error);
    }

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
