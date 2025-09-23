import prisma from "@/lib/db";
import { TPaginationNumbers } from "@/types/common";
import { createResponse } from "@/utils/createResponse";
import { Prisma, Resource } from "@prisma/client";
import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page") || "1");
    const search = searchParams.get("search") || "";
    const filterType = searchParams.get("fileType") || null;

    const limitPerType = 5;
    const skip = (page - 1) * limitPerType;

    const baseWhere: Prisma.ResourceWhereInput = search
      ? { title: { contains: search, mode: "insensitive" as Prisma.QueryMode } }
      : {};

    let resources: { pdfs?: Resource[]; videos?: Resource[] } = {};
    let pagination: { pdf: TPaginationNumbers; video: TPaginationNumbers } = {
      pdf: { total: 0, totalPages: 0 },
      video: { total: 0, totalPages: 0 },
    };

    if (!filterType || filterType === "PDF") {
      const [pdfs, pdfCount] = await Promise.all([
        prisma.resource.findMany({
          where: { ...baseWhere, fileType: "PDF" },
          skip,
          take: limitPerType,
          orderBy: { createdAt: "desc" },
        }),
        prisma.resource.count({ where: { ...baseWhere, fileType: "PDF" } }),
      ]);

      resources.pdfs = pdfs;
      pagination.pdf = {
        total: pdfCount,
        totalPages: Math.ceil(pdfCount / limitPerType),
      };
    }

    if (!filterType || filterType === "VIDEO") {
      const [videos, videoCount] = await Promise.all([
        prisma.resource.findMany({
          where: { ...baseWhere, fileType: "VIDEO" },
          skip,
          take: limitPerType,
          orderBy: { createdAt: "desc" },
        }),
        prisma.resource.count({ where: { ...baseWhere, fileType: "VIDEO" } }),
      ]);

      resources.videos = videos;
      pagination.video = {
        total: videoCount,
        totalPages: Math.ceil(videoCount / limitPerType),
      };
    }

    if (!resources.pdfs && !resources.videos) {
      return NextResponse.json(
        createResponse(false, "No resources found.", null),
        { status: 404 }
      );
    }

    return NextResponse.json(
      createResponse(true, "Resources fetched successfully.", {
        resources,
        pagination: { page, ...pagination },
      }),
      { status: 200 }
    );
  } catch (error) {
    console.error("Error in fetching resources", error);
    const errorMessage = error instanceof Error ? error.message : String(error);
    return NextResponse.json(createResponse(false, errorMessage, null), {
      status: 500,
    });
  }
}

export async function POST(req: NextRequest) {
  try {
    // const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

    // if (!token || token.role !== "admin") {
    //   return NextResponse.json(createResponse(false, "Unauthorized", null), {
    //     status: 401,
    //   });
    // }

    const resource = await req.json();

    await prisma.resource.create({
      data: resource,
    });

    return NextResponse.json(
      createResponse(true, "Resource created successfully.", null),
      { status: 201 }
    );
  } catch (error) {
    console.log("Error in creating resource ", error);
    const errorMessage = error instanceof Error ? error.message : String(error);
    return NextResponse.json(createResponse(false, errorMessage, null), {
      status: 500,
    });
  }
}
