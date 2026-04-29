import { TokenRoles } from "@/constants/UserRoles";
import prisma from "@/lib/db";
import { createResponse } from "@/utils/createResponse";
import { Prisma } from "@prisma/client";
import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";

/**
 * @swagger
 * /api/reports:
 *   get:
 *     summary: Get reports
 *     tags: [Reports]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search reports by title
 *       - in: query
 *         name: appointmentId
 *         schema:
 *           type: string
 *         description: Filter reports by appointment ID
 *     responses:
 *       200:
 *         description: Reports fetched successfully
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               message: "Reports fetched successfully."
 *               data:
 *                 reports:
 *                   videos:
 *                     - id: "rep_01HXYZ1234ABCDE"
 *                       title: "Post-op Video"
 *                       fileType: "VIDEO"
 *                       fileUrl: "https://example.com/reports/post-op.mp4"
 *                   pdfs:
 *                     - id: "rep_01HXYZ1234ABCDF"
 *                       title: "X-Ray Report"
 *                       fileType: "PDF"
 *                       fileUrl: "https://example.com/reports/xray.pdf"
 *       404:
 *         description: No reports found
 *         content:
 *           application/json:
 *             example:
 *               status: false
 *               message: "No reports found."
 *               data: null
 *       500:
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             example:
 *               status: false
 *               message: "Internal Server Error"
 *               data: null
 *   post:
 *     summary: Create report(s)
 *     tags: [Reports]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             oneOf:
 *               - type: object
 *               - type: array
 *                 items:
 *                   type: object
 *             example:
 *               appointmentId: clx123abc
 *               patientId: clx456def
 *               title: X-Ray Report
 *               fileType: PDF
 *     responses:
 *       201:
 *         description: Reports created successfully
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               message: "Reports created successfully."
 *               data: null
 *       400:
 *         description: Validation failed
 *         content:
 *           application/json:
 *             example:
 *               status: false
 *               message: "Each report must include patientId and appointmentId."
 *               data: null
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             example:
 *               status: false
 *               message: "Unauthorized"
 *               data: null
 *       404:
 *         description: Appointment not found for the dentist
 *         content:
 *           application/json:
 *             example:
 *               status: false
 *               message: "Appointment not found for the dentist."
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
