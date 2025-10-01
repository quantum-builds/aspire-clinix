import { TokenRoles } from "@/constants/UserRoles";
import prisma from "@/lib/db";
import { createResponse } from "@/utils/createResponse";
import { Prisma } from "@prisma/client";
import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    // const token = await getToken({
    //   req,
    // });

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
      // ...(dentistId ? { dentistId } : {}),
      // ...(patientId ? { patientId } : {}),
      ...(appointmentId ? { appointmentId } : {}),
    };

    // fetch videos
    const videos = await prisma.report.findMany({
      where: { ...baseWhere, fileType: "VIDEO" },
      orderBy: { createdAt: "desc" },
      include: { patient: true, dentist: true },
    });

    // fetch pdfs
    const pdfs = await prisma.report.findMany({
      where: { ...baseWhere, fileType: "PDF" },
      orderBy: { createdAt: "desc" },
      include: { patient: true, dentist: true },
    });

    if (!videos.length && !pdfs.length) {
      return NextResponse.json(
        createResponse(false, "No reports found.", null),
        { status: 404 }
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
    const report = await req.json();

    await prisma.report.create({
      data: { ...report, dentistId },
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
