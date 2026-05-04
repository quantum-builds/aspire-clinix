import { TokenRoles } from "@/constants/UserRoles";
import prisma from "@/lib/db";
import { TPaginationNumbers } from "@/types/common";
import { createResponse } from "@/utils/createResponse";
import { Prisma, Resource } from "@prisma/client";
import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";

/**
 * @swagger
 * /api/resources:
 *   get:
 *     summary: Get resources with pagination and filters
 *     tags: [Resources]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number for pagination
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search resources by title
 *       - in: query
 *         name: fileType
 *         schema:
 *           type: string
 *           enum: [PDF, VIDEO]
 *         description: Filter by file type
 *       - in: query
 *         name: on
 *         schema:
 *           type: string
 *           format: date
 *         description: Filter resources created on this date
 *       - in: query
 *         name: before
 *         schema:
 *           type: string
 *           format: date
 *         description: Filter resources created before this date
 *       - in: query
 *         name: after
 *         schema:
 *           type: string
 *           format: date
 *         description: Filter resources created after this date
 *     responses:
 *       200:
 *         description: Resources fetched successfully
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               message: "Resources fetched successfully."
 *               data:
 *                 resources:
 *                   pdfs:
 *                     - id: "res_01HXYZ1234ABCDE"
 *                       title: "Root Canal Guide"
 *                       fileUrl: "https://example.com/resources/root-canal-guide.pdf"
 *                       fileType: "PDF"
 *                   videos:
 *                     - id: "res_01HXYZ1234ABCDF"
 *                       title: "Implant Procedure"
 *                       fileUrl: "https://example.com/resources/implant-procedure.mp4"
 *                       fileType: "VIDEO"
 *                 pagination:
 *                   page: 1
 *                   pdf:
 *                     total: 12
 *                     totalPages: 3
 *                   video:
 *                     total: 8
 *                     totalPages: 2
 *       404:
 *         description: No resources found
 *         content:
 *           application/json:
 *             example:
 *               status: false
 *               message: "No resources found."
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
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page") || "1");
    const search = searchParams.get("search") || "";
    const filterType = searchParams.get("fileType") || null;
    const on = searchParams.get("on") || "";
    const before = searchParams.get("before") || "";
    const after = searchParams.get("after") || "";

    const limitPerType = 5;
    const skip = (page - 1) * limitPerType;

    const baseWhere: Prisma.ResourceWhereInput = search
      ? { title: { contains: search, mode: "insensitive" as Prisma.QueryMode } }
      : {};

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
        { status: 404 },
      );
    }

    return NextResponse.json(
      createResponse(true, "Resources fetched successfully.", {
        resources,
        pagination: { page, ...pagination },
      }),
      { status: 200 },
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
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

    if (!token) {
      return NextResponse.json(createResponse(false, "Unauthorized", null), {
        status: 401,
      });
    }

    if (token.role !== TokenRoles.ADMIN) {
      return NextResponse.json(createResponse(false, "Forbidden", null), {
        status: 403,
      });
    }

    const body = await req.json();

    const resources = Array.isArray(body) ? body : [body];

    if (!resources.length) {
      return NextResponse.json(
        createResponse(false, "No resources provided", null),
        { status: 400 },
      );
    }

    await prisma.resource.createMany({
      data: resources,
    });

    return NextResponse.json(
      createResponse(true, "Resources created successfully.", null),
      { status: 201 },
    );
  } catch (error) {
    console.log("Error in creating resources ", error);
    const errorMessage = error instanceof Error ? error.message : String(error);
    return NextResponse.json(createResponse(false, errorMessage, null), {
      status: 500,
    });
  }
}
