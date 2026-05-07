import sendgrid from "@/config/sendgrid-config";
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

    if (!token) {
      return NextResponse.json(createResponse(false, "Unauthorized", null), {
        status: 401,
      });
    }

    const dentistId =
      token?.role === TokenRoles.DENTALLY_PRACTITIONER ? token.sub : undefined;
    const patientDentallyId =
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
      ...(patientDentallyId ? { patientDentallyId } : {}),
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

    if (!token) {
      return NextResponse.json(createResponse(false, "Unauthorized", null), {
        status: 401,
      });
    }

    if (token.role !== TokenRoles.DENTALLY_PRACTITIONER) {
      return NextResponse.json(createResponse(false, "Forbidden", null), {
        status: 403,
      });
    }

    const dentistId = token.sub;
    const body = await req.json();

    const reports = Array.isArray(body) ? body : [body];
    console.log("reports are ", reports);
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
      (report) => !report?.patientDentallyId || !report?.appointmentId,
    );

    if (invalidReportIndex !== -1) {
      return NextResponse.json(
        createResponse(
          false,
          `Each report must include patientDentallyId and appointmentId.`,
          null,
        ),
        { status: 400 },
      );
    }

    const dentist = await prisma.dentist.findFirst({
      where: {
        dentallyId: Number(dentistId),
        appointmentIds: {
          has: appointmentId,
        },
      },
    });
    console.log("appointment id ", appointmentId);

    if (!dentist) {
      return NextResponse.json(
        createResponse(false, "Appointment not found for the dentist.", null),
        { status: 404 },
      );
    }

    const patientDentallyIds = Array.from(
      new Set(reports.map((r) => r.patientDentallyId)),
    );
    const dentallyNumbers = patientDentallyIds.map((d) => Number(d));
    const patients = await prisma.patient.findMany({
      where: { dentallyId: { in: dentallyNumbers } },
      select: { id: true, dentallyId: true, email: true, name: true },
    });
    const dentallyToPatient = new Map<
      number,
      { id: string; email: string; name: string }
    >();
    for (const p of patients) {
      dentallyToPatient.set(Number(p.dentallyId ?? 0), {
        id: p.id,
        email: p.email,
        name: p.name,
      });
    }

    const missing = dentallyNumbers.filter((n) => !dentallyToPatient.has(n));
    if (missing.length) {
      return NextResponse.json(
        createResponse(
          false,
          `Patients not found for dentallyIds: ${missing.join(", ")}`,
          null,
        ),
        { status: 400 },
      );
    }

    // fetch dentist details (email/name) to notify if needed
    const dentistDetails = await prisma.dentist.findFirst({
      where: {
        dentallyId: Number(dentistId),
        appointmentIds: { has: appointmentId },
      },
      select: { id: true, email: true, firstName: true, lastName: true },
    });

    // create reports individually so we can notify recipients after creation
    const createdReports: Array<{
      title: string;
      recipientType?: string;
      patientDentallyId?: string;
    }> = [];

    await prisma.$transaction(async (tx) => {
      for (const r of reports) {
        const patientInfo = dentallyToPatient.get(Number(r.patientDentallyId));
        const data: Prisma.ReportCreateInput = {
          dentist: { connect: { id: dentist.id } },
          patientDentallyId: r.patientDentallyId,
          appointmentId: r.appointmentId,
          title: r.title ?? "Report",
          fileUrl: r.fileUrl ?? "",
          fileType:
            (r.fileType as Prisma.ReportCreateManyInput["fileType"]) ?? "PDF",
        } as any;

        if (patientInfo) {
          (data as any).patient = { connect: { id: patientInfo.id } };
        }

        if (r.recipientType) {
          (data as any).recipientType = r.recipientType;
        }

        const created = await tx.report.create({ data });
        createdReports.push({
          title: created.title,
          recipientType: r.recipientType,
          patientDentallyId: r.patientDentallyId,
        });
      }
    });

    // aggregate notifications
    const patientNotifications = new Map<
      string,
      { email: string; name: string; titles: string[] }
    >();
    const dentistNotifications = new Map<
      string,
      { email: string; name: string; titles: string[] }
    >();

    for (const cr of createdReports) {
      const recipient = cr.recipientType ?? "PATIENT";
      if (recipient === "PATIENT") {
        const info = dentallyToPatient.get(Number(cr.patientDentallyId));
        if (info && info.email) {
          const existing = patientNotifications.get(info.id);
          if (existing) existing.titles.push(cr.title);
          else
            patientNotifications.set(info.id, {
              email: info.email,
              name: info.name,
              titles: [cr.title],
            });
        }
      } else if (recipient === "REFERRING_DENTIST") {
        if (dentistDetails && dentistDetails.email) {
          const did = dentistDetails.id;
          const name =
            `${dentistDetails.firstName ?? ""} ${dentistDetails.lastName ?? ""}`.trim();
          const existing = dentistNotifications.get(did);
          if (existing) existing.titles.push(cr.title);
          else
            dentistNotifications.set(did, {
              email: dentistDetails.email,
              name: name || "Dentist",
              titles: [cr.title],
            });
        }
      }
    }

    // send notification emails
    const emailPromises: Promise<any>[] = [];

    const fromEmail = process.env.EMAIL_FROM;
    if (!fromEmail) {
      console.error(
        "EMAIL_FROM is not configured; skipping notification emails",
      );
    }

    const baseUrl =
      process.env.NEXT_PUBLIC_API_BASE_URL ;

    for (const [, info] of patientNotifications) {
      const patientLink = `${baseUrl}/patient/appointments/${appointmentId}/reports`;
      const html = `
        <div style="font-family: Arial, sans-serif; line-height: 1.5; color: #111827;">
          <p>Hi ${info.name || "there"},</p>
          <p>Your report hase been share by the dentist ${dentistDetails?.firstName} ${dentistDetails?.lastName}</p>
          <ul>
            ${info.titles.map((t) => `<li>${t}</li>`).join("")}
          </ul>
          <p>You can view them here: <a href="${patientLink}">Link</a></p>
          <p>Please sign in to your Aspire account to view them.</p>
        </div>
      `;

      if (fromEmail) {
        emailPromises.push(
          sendgrid.send({
            from: fromEmail,
            to: info.email,
            subject: "New report(s) available on Aspire",
            html,
            text: undefined,
          }),
        );
      }
    }

    for (const [, info] of dentistNotifications) {
      const dentistLink = `${baseUrl}/dentist/appointments/${appointmentId}/reports/new`;
      const html = `
        <div style="font-family: Arial, sans-serif; line-height: 1.5; color: #111827;">
          <p>Hi ${info.name || "there"},</p>
          <p>Your referring dentist has shared new report(s) with you:</p>
          <ul>
            ${info.titles.map((t) => `<li>${t}</li>`).join("")}
          </ul>
          <p>Open the reports page: <a href="${dentistLink}">${dentistLink}</a></p>
          <p>Please sign in to your Aspire account to view them.</p>
        </div>
      `;

      if (fromEmail) {
        emailPromises.push(
          sendgrid.send({
            from: fromEmail,
            to: info.email,
            subject: "New report(s) added",
            html,
            text: undefined,
          }),
        );
      }
    }

    try {
      await Promise.all(emailPromises);
    } catch (err) {
      console.error("Error sending notification emails", err);
    }

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
