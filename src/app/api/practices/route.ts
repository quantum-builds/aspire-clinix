import { TokenRoles } from "@/constants/UserRoles";
import prisma from "@/lib/db";
import { createResponse } from "@/utils/createResponse";
import { Prisma } from "@prisma/client";
import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";

/**
 * @swagger
 * /api/practices:
 *   post:
 *     summary: Create a practice
 *     tags: [Practices]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               name:
 *                 type: string
 *               phoneNumber:
 *                 type: string
 *               postcode:
 *                 type: string
 *               timeZone:
 *                 type: string
 *               town:
 *                 type: string
 *               nhs:
 *                 type: boolean
 *               openingHours:
 *                 type: object
 *               addressLine1:
 *                 type: string
 *               addressLine2:
 *                 type: string
 *               logoUrl:
 *                 type: string
 *                 nullable: true
 *             example:
 *               email: clinic@example.com
 *               name: Aspire Clinic
 *               phoneNumber: '+441234567890'
 *               postcode: SW1A 1AA
 *               timeZone: Europe/London
 *               town: London
 *               nhs: false
 *               openingHours:
 *                 monday:
 *                   open: '09:00'
 *                   close: '17:30'
 *                 tuesday:
 *                   open: '09:00'
 *                   close: '17:30'
 *               addressLine1: 10 High Street
 *               addressLine2: Westminster
 *               logoUrl: null
 *     responses:
 *       201:
 *         description: Practices created successfully
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               message: "Practices created successfully"
 *               data:
 *                 id: "ckx1r2a3b0001s2v1b1b2c3d4"
 *                 email: "clinic@example.com"
 *                 name: "Aspire Clinic"
 *                 phoneNumber: "+441234567890"
 *                 postcode: "SW1A 1AA"
 *                 timeZone: "Europe/London"
 *                 town: "London"
 *                 nhs: false
 *                 openingHours:
 *                   monday:
 *                     open: "09:00"
 *                     close: "17:30"
 *                 addressLine1: "10 High Street"
 *                 addressLine2: "Westminster"
 *                 logoUrl: null
 *                 createdAt: "2026-04-29T10:00:00.000Z"
 *                 updatedAt: "2026-04-29T10:00:00.000Z"
 *       500:
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             example:
 *               status: false
 *               message: "Internal Server Error"
 *               data: null
 *   get:
 *     summary: Get practices
 *     tags: [Practices]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search practices by ID
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [true, false]
 *         description: Filter by NHS status
 *     responses:
 *       200:
 *         description: Practices fetched successfully
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               message: "Practices fetched successfully"
 *               data:
 *                 practices:
 *                   - id: "ckx1r2a3b0001s2v1b1b2c3d4"
 *                     name: "Aspire Clinic"
 *                     nhs: false
 *                     town: "London"
 *                     createdAt: "2026-04-29T10:00:00.000Z"
 *                     updatedAt: "2026-04-29T10:00:00.000Z"
 *                 pagination:
 *                   page: 1
 *                   total: 12
 *                   totalPages: 2
 *       404:
 *         description: No practice found
 *         content:
 *           application/json:
 *             example:
 *               status: false
 *               message: "No practice found"
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
export async function POST(req: NextRequest) {
  try {
    // const token = await getToken({ req });

    // if (!token || token.role !== TokenRoles.ADMIN) {
    //   return NextResponse.json(
    //     createResponse(false, "Forbidden to perform this action", null),
    //     {
    //       status: 403,
    //     }
    //   );
    // }

    const practice = await req.json();
    const newPractce = await prisma.practice.create({
      data: { ...practice },
    });

    return NextResponse.json(
      createResponse(true, "Practices created successfully", newPractce),
      { status: 201 },
    );
  } catch (error) {
    console.log("Error in creating appointment ", error);
    const errorMessage = error instanceof Error ? error.message : String(error);
    return NextResponse.json(createResponse(false, errorMessage, null), {
      status: 500,
    });
  }
}

export async function GET(req: NextRequest) {
  try {
    // const token = await getToken({ req });

    // if (!token || token.role !== TokenRoles.ADMIN) {
    //   return NextResponse.json(
    //     createResponse(false, "Forbidden to perform this action", null),
    //     {
    //       status: 403,
    //     }
    //   );
    // }

    const { searchParams } = new URL(req.url);

    const page = parseInt(searchParams.get("page") || "1", 10);
    const search = searchParams.get("search") || "";
    const statusParam = searchParams.get("status") || "";

    const limit = 10;
    const skip = (page - 1) * limit;

    const nhsFilter =
      statusParam !== "" ? statusParam.toLowerCase() === "true" : undefined;

    const baseWhere: Prisma.PracticeWhereInput = {
      ...(search && { id: { contains: search, mode: "insensitive" } }),
      ...(nhsFilter !== undefined && { nhs: nhsFilter }),
    };

    const [practices, totalCount] = await Promise.all([
      prisma.practice.findMany({
        where: baseWhere,
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
      }),
      prisma.practice.count({ where: baseWhere }),
    ]);

    if (!practices || practices.length < 1) {
      return NextResponse.json(
        createResponse(false, "No practice found", null),
        {
          status: 404,
        },
      );
    }
    return NextResponse.json(
      createResponse(true, "Practices fetched successfully", {
        practices,
        pagination: {
          page,
          total: totalCount,
          totalPages: Math.ceil(totalCount / limit),
        },
      }),
      {
        status: 200,
      },
    );
  } catch (error) {
    console.log("Error in fetching practices ", error);
    const errorMessage = error instanceof Error ? error.message : String(error);
    return NextResponse.json(createResponse(false, errorMessage, null), {
      status: 500,
    });
  }
}
