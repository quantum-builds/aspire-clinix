import { TokenRoles } from "@/constants/UserRoles";
import prisma from "@/lib/db";
import { AppointmentDateType } from "@/types/common";
import { createResponse } from "@/utils/createResponse";
import { AppointmentStatus, DentistRole, Prisma } from "@prisma/client";
import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";

/**
 * @swagger
 * /api/olDAppointments:
 *   get:
 *     summary: Get old appointments
 *     tags: [Old Appointments]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: query
 *         name: on
 *         schema:
 *           type: string
 *           format: date
 *       - in: query
 *         name: before
 *         schema:
 *           type: string
 *           format: date
 *       - in: query
 *         name: after
 *         schema:
 *           type: string
 *           format: date
 *       - in: query
 *         name: updated_after
 *         schema:
 *           type: string
 *           format: date
 *       - in: query
 *         name: practitioner_id
 *         schema:
 *           type: string
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *       - in: query
 *         name: dateType
 *         schema:
 *           type: string
 *           enum: [PAST, UPCOMING]
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [PENDING, CONFIRMED, CANCELLED, COMPLETED]
 *     responses:
 *       200:
 *         description: Appointments fetched successfully
 *       403:
 *         description: Unauthorized
 *       404:
 *         description: No appointments found
 *       500:
 *         description: Internal Server Error
 *   post:
 *     summary: Create an old appointment
 *     tags: [Old Appointments]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               dentistId:
 *                 type: string
 *               practiceId:
 *                 type: string
 *               patientId:
 *                 type: string
 *               reason:
 *                 type: string
 *               state:
 *                 type: string
 *                 enum: [PENDING, CONFIRMED, CANCELLED, COMPLETED]
 *               date:
 *                 type: string
 *                 format: date-time
 *               startTime:
 *                 type: string
 *                 format: date-time
 *               finishTime:
 *                 type: string
 *                 format: date-time
 *     responses:
 *       201:
 *         description: Appointment created successfully
 *       500:
 *         description: Internal Server Error
 */
export async function GET(req: NextRequest) {
  try {
    const token = await getToken({
      req,
    });

    if (token && token.role === TokenRoles.REFERRING_DENTIST) {
      return NextResponse.json(createResponse(false, "Unauthrized.", null), {
        status: 403,
      });
    }
    let patientId = "";
    let dentistId = "";

    if (token && token.role === TokenRoles.PATIENT) {
      patientId = token.sub || "";
    } else if (
      token &&
      (token.role === TokenRoles.DENTIST ||
        token.role === TokenRoles.RECIEVING_DENTIST)
    ) {
      dentistId = token.sub || "";
    }
    const { searchParams } = new URL(req.url);

    const on = searchParams.get("on") || "";
    const before = searchParams.get("before") || "";
    const after = searchParams.get("after") || "";
    const updatedAfter = searchParams.get("updated_after") || "";
    const practitionerId = searchParams.get("practitioner_id") || "";
    const page = parseInt(searchParams.get("page") || "1", 10);

    const search = searchParams.get("search") || "";
    const dateType = searchParams.get("dateType") as AppointmentDateType | null;
    const statusParam = searchParams.get("status") || "";

    const limit = 10;
    const skip = (page - 1) * limit;

    const status =
      statusParam &&
      Object.values(AppointmentStatus).includes(
        statusParam as AppointmentStatus,
      )
        ? (statusParam as AppointmentStatus)
        : undefined;

    let baseWhere: Prisma.AppointmentWhereInput = {
      ...(search && { id: { contains: search, mode: "insensitive" } }),
      ...(patientId && { patientId }),
      ...(dentistId && { dentistId }),
      state: status, // always set, defaults to PENDING
    };

    const now = new Date();
    const todayStart = new Date(now.setHours(0, 0, 0, 0));
    const todayEnd = new Date(now.setHours(23, 59, 59, 999));

    if (on || before || after) {
      baseWhere.date = {
        ...(on && {
          gte: new Date(on),
          lt: new Date(new Date(on).setDate(new Date(on).getDate() + 1)),
        }),
        ...(before && { lte: new Date(before) }),
        ...(after && { gte: new Date(after) }),
      };
    } else if (dateType === AppointmentDateType.PAST) {
      baseWhere = {
        ...baseWhere,
        OR: [
          // past appointments before today
          { date: { lt: todayStart } },
          // appointments today that already finished
          {
            date: { gte: todayStart, lte: todayEnd },
            finishTime: { lt: new Date() },
          },
        ],
      };
    } else if (dateType === AppointmentDateType.UPCOMING) {
      baseWhere = {
        ...baseWhere,
        OR: [
          // appointments after today
          { date: { gt: todayEnd } },
          // appointments today that haven't started yet
          {
            date: { gte: todayStart, lte: todayEnd },
            startTime: { gte: new Date() },
          },
        ],
      };
    }

    const [appointments, totalCount] = await Promise.all([
      prisma.appointment.findMany({
        where: baseWhere,
        skip,
        take: limit,
        orderBy: { date: "desc" },
        include: {
          dentist: true,
        },
      }),
      prisma.appointment.count({ where: baseWhere }),
    ]);

    if (!appointments.length) {
      return NextResponse.json(
        createResponse(false, "No appointments found.", null),
        { status: 404 },
      );
    }

    return NextResponse.json(
      createResponse(true, "Appointments fetched successfully.", {
        appointments,
        pagination: {
          page,
          total: totalCount,
          totalPages: Math.ceil(totalCount / limit),
        },
      }),
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

export async function POST(req: NextRequest) {
  try {
    const appointment = await req.json();
    const newAppointment = await prisma.appointment.create({
      data: {
        dentistId: appointment.dentistId,
        practiceId: appointment.practiceId,
        patientId: appointment.patientId,
        reason: appointment.reason || "",
        state: appointment.state || "PENDING",
        date: new Date(appointment.date),
        startTime: new Date(appointment.startTime),
        finishTime: new Date(appointment.finishTime),
      },
    });
    const dentist = await prisma.dentist.findUnique({
      where: { id: appointment.dentistId },
    });
    if (dentist?.role === TokenRoles.REFERRING_DENTIST) {
      await prisma.dentist.update({
        where: { id: dentist.id },
        data: { role: DentistRole.DENTIST },
      });
    }
    return NextResponse.json(
      createResponse(true, "Appointment created successfully", newAppointment),
      { status: 201 },
    );
  } catch (error) {
    console.log("Error in creating appointment ", error);
    const errorMessage = error instanceof Error ? error.message : String(error);
    return NextResponse.json(createResponse(false, errorMessage, null), {
      status: 500,
    });
  }
}
