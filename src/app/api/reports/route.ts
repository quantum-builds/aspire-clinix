import prisma from "@/lib/db";
import { createResponse } from "@/utils/createResponse";
import { Prisma, Report } from "@prisma/client";
import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);

    const search = searchParams.get("search") || "";
    const dentistId = searchParams.get("dentistId") || null;
    let patientId = searchParams.get("patientId") || null;
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
    });

    // fetch pdfs
    const pdfs = await prisma.report.findMany({
      where: { ...baseWhere, fileType: "PDF" },
      orderBy: { createdAt: "desc" },
    });

    if (!videos.length && !pdfs.length) {
      return NextResponse.json(
        createResponse(false, "No reports found.", null),
        { status: 404 }
      );
    }

    let dentist = null;
    if (dentistId) {
      dentist = await prisma.dentist.findUnique({
        where: { id: dentistId },
        select: {
          id: true,
          fullName: true,
          gdcNo: true,
          phoneNumber: true,
          email: true,
          practiceAddress: true,
        },
      });
    }

    return NextResponse.json(
      createResponse(true, "Reports fetched successfully.", {
        dentist,
        reports: { videos, pdfs },
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
    // const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

    // if (!token || token.role !== "dentist") {
    //   return NextResponse.json(createResponse(false, "Unauthorized", null), {
    //     status: 401,
    //   });
    // }

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
