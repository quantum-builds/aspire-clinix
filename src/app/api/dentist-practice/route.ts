import prisma from "@/lib/db";
import { createResponse } from "@/utils/createResponse";
import { PracticeApprovalStatus, Prisma } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

/**
 * @swagger
 * /api/dentist-practice:
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
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               message: "Data fetched successfully"
 *               data:
 *                 - practiceId: "ckx1r2a3b0001s2v1b1b2c3d4"
 *                   dentistId: "ckx1r2a3b0002s2v1b1b2c3d4"
 *                   status: "PENDING"
 *                   dentist:
 *                     id: "ckx1r2a3b0002s2v1b1b2c3d4"
 *                     firstName: "Alex"
 *                     lastName: "Carter"
 *                   practice:
 *                     id: "ckx1r2a3b0001s2v1b1b2c3d4"
 *                     name: "Aspire Clinix"
 *       404:
 *         description: No Data Found
 *         content:
 *           application/json:
 *             example:
 *               status: false
 *               message: "No Data Found"
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

    const practiceId = searchParams.get("practiceId") || "";
    const dentistId = searchParams.get("dentistId") || "";
    const statusParam = searchParams.get("status") || "";

    const status =
      statusParam &&
      Object.values(PracticeApprovalStatus).includes(
        statusParam as PracticeApprovalStatus,
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
      { status: 200 },
    );
  } catch (error) {
    console.log("Error in fetching dentist-practice ", error);
    const errorMessage = error instanceof Error ? error.message : String(error);
    return NextResponse.json(createResponse(false, errorMessage, null), {
      status: 500,
    });
  }
}