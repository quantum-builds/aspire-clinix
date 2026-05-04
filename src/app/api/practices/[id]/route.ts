import { TokenRoles } from "@/constants/UserRoles";
import prisma from "@/lib/db";
import { createResponse } from "@/utils/createResponse";
import { isValidCuid } from "@/utils/typeValidUtils";
import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";

/**
 * @swagger
 * /api/practices/{id}:
 *   get:
 *     summary: Get a practice by ID with approved dentists
 *     tags: [Practices]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Practice ID (CUID)
 *     responses:
 *       200:
 *         description: Practice fetched successfully
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               message: "Practice fetched successfully"
 *               data:
 *                 id: "ckx1r2a3b0001s2v1b1b2c3d4"
 *                 name: "Aspire Clinic"
 *                 nhs: false
 *                 town: "London"
 *                 dentists:
 *                   - dentistId: "ckx1r2a3b0002s2v1b1b2c3d4"
 *                     status: "APPROVED"
 *                     dentist:
 *                       id: "ckx1r2a3b0002s2v1b1b2c3d4"
 *                       firstName: "Alex"
 *                       lastName: "Carter"
 *       400:
 *         description: Invalid Practice Id
 *         content:
 *           application/json:
 *             example:
 *               message: "Invalid Practice Id."
 *       403:
 *         description: Forbidden to perform this action
 *         content:
 *           application/json:
 *             example:
 *               status: false
 *               message: "Forbidden to perform this action"
 *               data: null
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
export async function GET(req: NextRequest) {
  try {
    const token = await getToken({ req });

    if (!token || token.role !== TokenRoles.ADMIN) {
      return NextResponse.json(
        createResponse(false, "Forbidden to perform this action", null),
        {
          status: 403,
        },
      );
    }

    const practiceId = req.nextUrl.pathname.split("/").pop();
    if (!practiceId || !isValidCuid(practiceId)) {
      return NextResponse.json(
        { message: "Invalid Practice Id." },
        { status: 400 },
      );
    }

    const practice = await prisma.practice.findUnique({
      where: { id: practiceId },
      include: {
        dentists: {
          where: { status: "APPROVED" },
          include: {
            dentist: true, // this pulls the actual Dentist record
          },
        },
      },
    });

    if (!practice) {
      return NextResponse.json(
        createResponse(false, "No practice found", null),
        {
          status: 404,
        },
      );
    }
    return NextResponse.json(
      createResponse(true, "Practice fetched successfully", practice),
      {
        status: 200,
      },
    );
  } catch (error) {
    console.log("Error in fetching practice", error);
    const errorMessage = error instanceof Error ? error.message : String(error);
    return NextResponse.json(createResponse(false, errorMessage, null), {
      status: 500,
    });
  }
}
