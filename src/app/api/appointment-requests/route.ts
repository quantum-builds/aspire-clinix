import prisma from "@/lib/db";
import { createResponse } from "@/utils/createResponse";
import { AppointmentRequestStatus, Prisma } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);

    const page = parseInt(searchParams.get("page") || "1", 10);
    const search = searchParams.get("search") || "";
    const patientId = searchParams.get("patientId") || "";
    const on = searchParams.get("on") || "";
    const before = searchParams.get("before") || "";
    const after = searchParams.get("after") || "";
    const status =
      searchParams.get("status") || AppointmentRequestStatus.PENDING;

    const limit = 5;
    const skip = (page - 1) * limit;

    let baseWhere: Prisma.AppointmentRequestsWhereInput = {
      ...(search && { id: { contains: search, mode: "insensitive" } }),
      ...(patientId && { patientId }),
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
        appointmentRequests: appointmentRequests,
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
    const appointmentRequest = await req.json();
    const newAppointment = await prisma.appointmentRequests.create({
      data: { ...appointmentRequest, status: AppointmentRequestStatus.PENDING },
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
