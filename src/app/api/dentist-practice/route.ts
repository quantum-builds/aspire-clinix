import prisma from "@/lib/db";
import { createResponse } from "@/utils/createResponse";
import { PracticeApprovalStatus, Prisma } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

/**
 * @swagger
 * /api/dentist-practice:
 *   post:
 *     summary: Create a dentist-practice relation
 *     tags: [Dentist Practice]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - practiceId
 *               - dentistId
 *             properties:
 *               practiceId:
 *                 type: string
 *               dentistId:
 *                 type: string
 *               status:
 *                 type: string
 *                 enum: [PENDING, APPROVED, REJECTED]
 *     responses:
 *       200:
 *         description: Data created successfully
 *       400:
 *         description: Missing required fields
 *       404:
 *         description: Practice, dentist, or relation not found
 *       500:
 *         description: Internal Server Error
 *   get:
 *     summary: Get dentist-practice relations
 *     tags: [Dentist Practice]
 *     parameters:
 *       - in: query
 *         name: practiceId
 *         schema:
 *           type: string
 *       - in: query
 *         name: dentistId
 *         schema:
 *           type: string
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [PENDING, APPROVED, REJECTED]
 *     responses:
 *       200:
 *         description: Data fetched successfully
 *       404:
 *         description: No Data Found
 *       500:
 *         description: Internal Server Error
 *   patch:
 *     summary: Update a dentist-practice relation
 *     tags: [Dentist Practice]
 *     parameters:
 *       - in: query
 *         name: practiceId
 *         required: true
 *         schema:
 *           type: string
 *       - in: query
 *         name: dentistId
 *         required: true
 *         schema:
 *           type: string
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [PENDING, APPROVED, REJECTED]
 *     responses:
 *       200:
 *         description: Data updated successfully
 *       400:
 *         description: Practice and Dentist Id is required
 *       404:
 *         description: No Data Found
 *       500:
 *         description: Internal Server Error
 */
export async function POST(req: NextRequest) {
  try {
    const { practiceId, dentistId, status } = await req.json();

    if (!practiceId || !dentistId) {
      return NextResponse.json(
        createResponse(false, "practiceId and dentistId are required", null),
        { status: 400 }
      );
    }

    const exitingRelation = await prisma.dentistOnPractice.findUnique({
      where: {
        practiceId_dentistId: {
          practiceId,
          dentistId,
        },
      },
    });

    if (exitingRelation) {
      return NextResponse.json(
        createResponse(
          false,
          "Dentist is already a part of the practice",
          null
        ),
        { status: 404 }
      );
    }

    const practice = await prisma.practice.findUnique({
      where: { id: practiceId },
    });

    if (!practice) {
      return NextResponse.json(
        createResponse(false, "Practice does not exist", null),
        { status: 404 }
      );
    }

    const dentist = await prisma.dentist.findUnique({
      where: { id: dentistId },
    });

    if (!dentist) {
      return NextResponse.json(
        createResponse(false, "Dentist does not exist", null),
        { status: 404 }
      );
    }

    await prisma.dentistOnPractice.create({
      data: {
        dentistId: dentistId,
        practiceId: practiceId,
        status: status,
      },
    });

    return NextResponse.json(
      createResponse(true, "Data created successfully", null),
      { status: 200 }
    );
  } catch (error) {
    console.log("Error in creating dentist-practice ", error);
    const errorMessage = error instanceof Error ? error.message : String(error);
    return NextResponse.json(createResponse(false, errorMessage, null), {
      status: 500,
    });
  }
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);

    const practiceId = searchParams.get("practiceId") || "";
    const dentistId = searchParams.get("dentistId") || "";
    const statusParam = searchParams.get("status") || "";

    const status =
      statusParam &&
      Object.values(PracticeApprovalStatus).includes(
        statusParam as PracticeApprovalStatus
      )
        ? (statusParam as PracticeApprovalStatus)
        : undefined;

    let baseWhere: Prisma.DentistOnPracticeWhereInput = {
      ...(practiceId && { practiceId }),
      ...(dentistId && { dentistId }),
      ...(status && { status }),
    };

    const data = await prisma.dentistOnPractice.findMany({
      where: baseWhere,
      include: { dentist: true, practice: true },
    });

    if (!data || data.length < 1) {
      return NextResponse.json(createResponse(false, "No Data Found", null), {
        status: 404,
      });
    }

    return NextResponse.json(
      createResponse(true, "Data fetched successfully", data),
      { status: 200 }
    );
  } catch (error) {
    console.log("Error in fetching dentist-practice ", error);
    const errorMessage = error instanceof Error ? error.message : String(error);
    return NextResponse.json(createResponse(false, errorMessage, null), {
      status: 500,
    });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);

    const practiceId = searchParams.get("practiceId") || "";
    const dentistId = searchParams.get("dentistId") || "";
    const statusParam = searchParams.get("status") || "";

    const status =
      statusParam &&
      Object.values(PracticeApprovalStatus).includes(
        statusParam as PracticeApprovalStatus
      )
        ? (statusParam as PracticeApprovalStatus)
        : undefined;

    if (!dentistId || !practiceId) {
      return NextResponse.json(
        createResponse(false, "Practice and Dentist Id is required", null),
        {
          status: 400,
        }
      );
    }

    const data = await prisma.dentistOnPractice.findUnique({
      where: {
        practiceId_dentistId: {
          practiceId,
          dentistId,
        },
      },
      include: { dentist: true, practice: true },
    });

    if (!data) {
      return NextResponse.json(createResponse(false, "No Data Found", null), {
        status: 404,
      });
    }

    const updatedData = await prisma.dentistOnPractice.update({
      where: {
        practiceId_dentistId: {
          practiceId,
          dentistId,
        },
      },
      data: { status: status },
    });

    return NextResponse.json(
      createResponse(true, "Data updated successfully", updatedData),
      { status: 200 }
    );
  } catch (error) {
    console.log("Error in updating dentist-practice ", error);
    const errorMessage = error instanceof Error ? error.message : String(error);
    return NextResponse.json(createResponse(false, errorMessage, null), {
      status: 500,
    });
  }
}
