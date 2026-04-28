import { TokenRoles } from "@/constants/UserRoles";
import prisma from "@/lib/db";
import { createResponse } from "@/utils/createResponse";
import { AppointmentRequestStatus, Prisma } from "@prisma/client";
import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";

/**
 * @swagger
 * /api/appointment-requests:
 *   get:
 *     summary: Get appointment requests
 *     tags: [Appointment Requests]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search requests by ID
 *       - in: query
 *         name: on
 *         schema:
 *           type: string
 *           format: date
 *         description: Filter requests on this date
 *       - in: query
 *         name: before
 *         schema:
 *           type: string
 *           format: date
 *         description: Filter requests before this date
 *       - in: query
 *         name: after
 *         schema:
 *           type: string
 *           format: date
 *         description: Filter requests after this date
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [PENDING, APPROVED, REJECTED]
 *         description: Filter by appointment request status
 *     responses:
 *       200:
 *         description: Appointment requests fetched successfully
 *       403:
 *         description: Unauthorized
 *       404:
 *         description: No appointment request found
 *       500:
 *         description: Internal Server Error
 *   post:
 *     summary: Create an appointment request
 *     tags: [Appointment Requests]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               appointmentId:
 *                 type: string
 *                 description: ID of the appointment
 *               dentistId:
 *                 type: string
 *                 description: ID of the dentist
 *               notes:
 *                 type: string
 *                 description: Additional notes for the appointment request
 *               requestedDate:
 *                 type: string
 *                 format: date-time
 *                 description: Requested appointment date and time
 *             example:
 *               appointmentId: clx1234567890abcdefgh
 *               dentistId: clx0987654321abcdefgh
 *               notes: Please schedule at your earliest convenience
 *               requestedDate: '2026-05-15T14:00:00Z'
 *     responses:
 *       201:
 *         description: Appointment request created successfully
 *       403:
 *         description: Unauthorized
 *       500:
 *         description: Internal Server Error
 */
export async function GET(req: NextRequest) {
  try {
    const token = await getToken({
      req,
    });

    if (
      token &&
      token.role !== TokenRoles.PATIENT &&
      token.role !== TokenRoles.ADMIN
    ) {
      return NextResponse.json(createResponse(false, "Unauthrized.", null), {
        status: 403,
      });
    }

    let patientId = "";
    if (token && token.role === TokenRoles.PATIENT) {
      patientId = token.sub || "";
    }

    const { searchParams } = new URL(req.url);

    const page = parseInt(searchParams.get("page") || "1", 10);
    const search = searchParams.get("search") || "";
    const on = searchParams.get("on") || "";
    const before = searchParams.get("before") || "";
    const after = searchParams.get("after") || "";
    const statusParam = searchParams.get("status") || "";
    const limit = 5;
    const skip = (page - 1) * limit;

    // Narrow the type to your enum
    const status =
      statusParam &&
      Object.values(AppointmentRequestStatus).includes(
        statusParam as AppointmentRequestStatus,
      )
        ? (statusParam as AppointmentRequestStatus)
        : undefined;

    let baseWhere: Prisma.AppointmentRequestsWhereInput = {
      ...(search && { id: { contains: search, mode: "insensitive" } }),
      ...(patientId && { patientId }),
      ...(status && { status }),
    };

    // Date filters (on, before, after) have same precedence
    if (on || before || after) {
      baseWhere.createdAt = {
        ...(on && {
          gte: new Date(on),
          lt: new Date(new Date(on).setDate(new Date(on).getDate() + 1)),
        }),
        ...(before && { lte: new Date(before) }),
        ...(after && { gte: new Date(after) }),
      };
    }

    const [appointmentRequests, totalCount] = await Promise.all([
      prisma.appointmentRequests.findMany({
        where: baseWhere,
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
        include: { appointment: { include: { dentist: true } } },
      }),
      prisma.appointmentRequests.count({ where: baseWhere }),
    ]);

    if (!appointmentRequests.length) {
      return NextResponse.json(
        createResponse(false, "No appointment request found.", null),
        { status: 404 },
      );
    }

    return NextResponse.json(
      createResponse(true, "Appointments request fetched successfully.", {
        appointmentRequests,
        pagination: {
          page,
          total: totalCount,
          totalPages: Math.ceil(totalCount / limit),
        },
      }),
      { status: 200 },
    );
  } catch (error) {
    console.error("Error fetching appointment requests", error);
    const errorMessage = error instanceof Error ? error.message : String(error);
    return NextResponse.json(createResponse(false, errorMessage, null), {
      status: 500,
    });
  }
}

export async function POST(req: NextRequest) {
  try {
    const token = await getToken({
      req,
    });
    if (token && token.role !== TokenRoles.PATIENT) {
      return NextResponse.json(createResponse(false, "Unauthrized.", null), {
        status: 403,
      });
    }
    const patientId = token?.sub;
    const appointmentRequest = await req.json();
    const newAppointment = await prisma.appointmentRequests.create({
      data: {
        ...appointmentRequest,
        status: AppointmentRequestStatus.PENDING,
        patientId: patientId,
      },
    });

    return NextResponse.json(
      createResponse(
        true,
        "Appointment Request created successfully",
        newAppointment,
      ),
      { status: 201 },
    );
  } catch (error) {
    console.log("Error in creating appointment request", error);
    const errorMessage = error instanceof Error ? error.message : String(error);
    return NextResponse.json(createResponse(false, errorMessage, null), {
      status: 500,
    });
  }
}
