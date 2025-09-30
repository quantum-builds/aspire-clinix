import { TokenRoles } from "@/constants/UserRoles";
import prisma from "@/lib/db";
import { createResponse } from "@/utils/createResponse";
import { AppointmentRequestStatus, Prisma } from "@prisma/client";
import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const token = await getToken({
      req,
    });

    console.log("token is ", token);

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
        statusParam as AppointmentRequestStatus
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
        include: { patient: true },
      }),
      prisma.appointmentRequests.count({ where: baseWhere }),
    ]);

    if (!appointmentRequests.length) {
      return NextResponse.json(
        createResponse(false, "No appointment request found.", null),
        { status: 404 }
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
      { status: 200 }
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
    // console.log("token is", token);
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
        newAppointment
      ),
      { status: 201 }
    );
  } catch (error) {
    console.log("Error in creating appointment request", error);
    const errorMessage = error instanceof Error ? error.message : String(error);
    return NextResponse.json(createResponse(false, errorMessage, null), {
      status: 500,
    });
  }
}
