import { TokenRoles } from "@/constants/UserRoles";
import prisma from "@/lib/db";
import { createResponse } from "@/utils/createResponse";
import { Prisma } from "@prisma/client";
import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const token = await getToken({
      req,
    });
    const dentistId =
      token?.role === TokenRoles.DENTIST ? token.sub : undefined;
    const patientId =
      token?.role === TokenRoles.PATIENT ? token.sub : undefined;

    const { searchParams } = new URL(req.url);

    const search = searchParams.get("search") || "";
    // const dentistId = searchParams.get("dentistId") || null;
    // let patientId = searchParams.get("patientId") || null;
    let appointmentId = searchParams.get("appointmentId") || null;

    const baseWhere: Prisma.ReportWhereInput = {
      ...(search
        ? {
            title: {
              contains: search,
              mode: "insensitive" as Prisma.QueryMode,
            },
          }
        : {}),
      ...(dentistId ? { dentistId } : {}),
      ...(patientId ? { patientId } : {}),
      ...(appointmentId ? { appointmentId } : {}),
    };

    // fetch videos
    const videos = await prisma.report.findMany({
      where: { ...baseWhere, fileType: "VIDEO" },
      orderBy: { createdAt: "desc" },
      include: { dentist: true },
    });

    // fetch pdfs
    const pdfs = await prisma.report.findMany({
      where: { ...baseWhere, fileType: "PDF" },
      orderBy: { createdAt: "desc" },
      include: { dentist: true },
    });

    if (!videos.length && !pdfs.length) {
      return NextResponse.json(
        createResponse(false, "No reports found.", null),
        { status: 404 },
      );
    }

    // let dentist = null;
    // let patient = null;
    // if (token && token.role === TokenRoles.RECIEVING_DENTIST && token.sub) {
    //   dentist = await prisma.patient.findUnique({
    //     where: { id: videos[0].patientId },
    //   });
    // } else if (
    //   token &&
    //   token.sub &&
    //   ((token.role === TokenRoles.DENTIST && token.role) ||
    //     TokenRoles.REFERRING_DENTIST)
    // ) {
    //   dentist = await prisma.dentist.findUnique({
    //     where: { id: token.sub },
    //   });
    //   patient;
    // }

    // if (dentistId) {
    //   dentist = await prisma.dentist.findUnique({
    //     where: { id: dentistId },
    //     select: {
    //       id: true,
    //       fullName: true,
    //       gdcNo: true,
    //       phoneNumber: true,
    //       email: true,
    //       practiceAddress: true,
    //     },
    //   });
    // }

    return NextResponse.json(
      createResponse(true, "Reports fetched successfully.", {
        reports: { videos, pdfs },
      }),
      { status: 200 },
    );
  } catch (error) {
    console.error("Error in fetching reports", error);
    const errorMessage = error instanceof Error ? error.message : String(error);
    return NextResponse.json(createResponse(false, errorMessage, null), {
      status: 500,
    });
  }
}

export async function POST(req: NextRequest) {
  try {
    const token = await getToken({ req });

    if (
      !token ||
      (token.role !== TokenRoles.DENTIST &&
        token.role !== TokenRoles.RECIEVING_DENTIST)
    ) {
      return NextResponse.json(createResponse(false, "Unauthorized", null), {
        status: 401,
      });
    }

    const dentistId = token.sub;
    const body = await req.json();

    const reports = Array.isArray(body) ? body : [body];

    // define a set for appointmentIds to check if the appointmentId in each report belongs to the dentist
    const appointmentIdsSet = new Set<string>();
    reports.forEach((report) => {
      if (report.appointmentId) {
        appointmentIdsSet.add(report.appointmentId);
      }
    });

    if (appointmentIdsSet.size === 0 || appointmentIdsSet.size > 1) {
      return NextResponse.json(
        createResponse(
          false,
          "Each report must include the same appointmentId that belongs to the dentist.",
          null,
        ),
        { status: 400 },
      );
    }

    const appointmentId = Array.from(appointmentIdsSet)[0];

    if (!dentistId) {
      return NextResponse.json(
        createResponse(false, "Dentist id is required", null),
        { status: 400 },
      );
    }

    if (!reports.length) {
      return NextResponse.json(
        createResponse(false, "No reports provided", null),
        { status: 400 },
      );
    }

    const invalidReportIndex = reports.findIndex(
      (report) => !report?.patientId || !report?.appointmentId,
    );

    if (invalidReportIndex !== -1) {
      return NextResponse.json(
        createResponse(
          false,
          `Each report must include patientId and appointmentId.`,
          null,
        ),
        { status: 400 },
      );
    }

    const reportsToCreate = reports.map((r) => ({
      ...r,
      dentistId,
    }));

    const isExistingAppointment = await prisma.dentist.findFirst({
      where: {
        id: dentistId,
        appointmentIds: {
          has: appointmentId,
        },
      },
    });

    if (!isExistingAppointment) {
      return NextResponse.json(
        createResponse(false, "Appointment not found for the dentist.", null),
        { status: 404 },
      );
    }

    await prisma.report.createMany({
      data: reportsToCreate,
    });
    return NextResponse.json(
      createResponse(true, "Reports created successfully.", null),
      { status: 201 },
    );
  } catch (error) {
    console.error("Error in creating report ", error);
    const errorMessage = error instanceof Error ? error.message : String(error);
    return NextResponse.json(createResponse(false, errorMessage, null), {
      status: 500,
    });
  }
}
