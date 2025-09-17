import prisma from "@/lib/db";
import { TPaginationNumbers } from "@/types/common";
import { createResponse } from "@/utils/createResponse";
import { Prisma, Report } from "@prisma/client";
import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);

    const page = parseInt(searchParams.get("page") || "1");
    const search = searchParams.get("search") || "";
    const filterType = searchParams.get("fileType") || null;
    const dentistId = searchParams.get("dentistId") || null;
    let patientId = null;
    const token = await getToken({
      req,
      secret: process.env.NEXTAUTH_SECRET,
    });
    if (token && token.role === "patient") {
      patientId = token.id;
    }

    const limitPerType = 5;
    const skip = (page - 1) * limitPerType;

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
    };

    let reports: { videos?: Report[]; pdfs?: Report[] } = {};
    let pagination: { video: TPaginationNumbers; pdf: TPaginationNumbers } = {
      video: { total: 0, totalPages: 0 },
      pdf: { total: 0, totalPages: 0 },
    };

    if (!filterType || filterType === "VIDEO") {
      const [videos, videoCount] = await Promise.all([
        prisma.report.findMany({
          where: { ...baseWhere, fileType: "VIDEO" },
          skip,
          take: limitPerType,
          orderBy: { createdAt: "desc" },
        }),
        prisma.report.count({ where: { ...baseWhere, fileType: "VIDEO" } }),
      ]);

      reports.videos = videos;
      pagination.video = {
        total: videoCount,
        totalPages: Math.ceil(videoCount / limitPerType),
      };
    }

    if (!filterType || filterType === "PDF") {
      const [pdfs, pdfCount] = await Promise.all([
        prisma.report.findMany({
          where: { ...baseWhere, fileType: "PDF" },
          skip,
          take: limitPerType,
          orderBy: { createdAt: "desc" },
        }),
        prisma.report.count({ where: { ...baseWhere, fileType: "PDF" } }),
      ]);

      reports.pdfs = pdfs;
      pagination.pdf = {
        total: pdfCount,
        totalPages: Math.ceil(pdfCount / limitPerType),
      };
    }

    if (!reports.pdfs && !reports.videos) {
      return NextResponse.json(
        createResponse(false, "No reports found.", null),
        { status: 404 }
      );
    }

    return NextResponse.json(
      createResponse(true, "Reports fetched successfully.", {
        reports,
        pagination: { page, ...pagination },
      }),
      { status: 200 }
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
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

    if (!token || token.role !== "dentist") {
      return NextResponse.json(createResponse(false, "Unauthorized", null), {
        status: 401,
      });
    }

    const report = await req.json();

    await prisma.report.create({
      data: report,
    });

    return NextResponse.json(
      createResponse(true, "Resource created successfully.", null),
      { status: 201 }
    );
  } catch (error) {
    console.log("Error in creating report ", error);
    const errorMessage = error instanceof Error ? error.message : String(error);
    return NextResponse.json(createResponse(false, errorMessage, null), {
      status: 500,
    });
  }
}
