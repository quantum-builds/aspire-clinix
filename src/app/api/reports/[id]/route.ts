import prisma from "@/lib/db";
import { createResponse } from "@/utils/createResponse";
import { isValidCuid } from "@/utils/typeValidUtils";
import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";

/**
 * @swagger
 * /api/reports/{id}:
 *   patch:
 *     summary: Update a report by ID
 *     tags: [Reports]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Report ID (CUID)
 *     responses:
 *       200:
 *         description: Report updated successfully
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               message: "Report updated successfully."
 *               data: null
 *       400:
 *         description: Invalid Report Id
 *         content:
 *           application/json:
 *             example:
 *               status: false
 *               message: "Invalid Report Id."
 *               data: null
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             example:
 *               status: false
 *               message: "Unauthorized"
 *               data: null
 *       403:
 *         description: Unauthorized to update this report
 *         content:
 *           application/json:
 *             example:
 *               status: false
 *               message: "Unauthorized to update this report."
 *               data: null
 *       500:
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             example:
 *               status: false
 *               message: "Internal Server Error"
 *               data: null
 *   delete:
 *     summary: Delete a report by ID
 *     tags: [Reports]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Report ID (CUID)
 *     responses:
 *       200:
 *         description: Report deleted successfully
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               message: "Report deleted successfully."
 *               data: null
 *       400:
 *         description: Invalid Report Id
 *         content:
 *           application/json:
 *             example:
 *               status: false
 *               message: "Invalid Report Id."
 *               data: null
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             example:
 *               status: false
 *               message: "Unauthorized"
 *               data: null
 *       403:
 *         description: Unauthorized to delete this report
 *         content:
 *           application/json:
 *             example:
 *               status: false
 *               message: "Unauthorized to delete this report."
 *               data: null
 *       404:
 *         description: Report not found
 *         content:
 *           application/json:
 *             example:
 *               status: false
 *               message: "Report with this Id does not exist."
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
export async function PATCH(req: NextRequest) {
  try {
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

    if (!token || token.role !== "dentist") {
      return NextResponse.json(createResponse(false, "Unauthorized", null), {
        status: 401,
      });
    }

    const dentistId = token.sub;

    const reportId = req.nextUrl.pathname.split("/").pop();
    const report = await prisma.report.findUnique({
      where: { id: reportId },
    });

    if (!reportId || !isValidCuid(reportId)) {
      return NextResponse.json(
        createResponse(false, "Invalid Report Id.", null),
        { status: 400 },
      );
    }

    if (report?.dentistId !== dentistId) {
      NextResponse.json(
        createResponse(false, "Unauthorized to update this report.", null),
        { status: 403 },
      );
    }
    await prisma.report.update({
      where: { id: reportId },
      data: { dentistId },
    });
  } catch (error) {
    console.log("Error in updating report ", error);
    const errorMessage = error instanceof Error ? error.message : String(error);
    return NextResponse.json(createResponse(false, errorMessage, null), {
      status: 500,
    });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

    if (!token) {
      return NextResponse.json(createResponse(false, "Unauthorized", null), {
        status: 401,
      });
    }
    if (token.role !== "dentist") {
      return NextResponse.json(createResponse(false, "Unauthorized", null), {
        status: 403,
      });
    }

    const dentistId = token.sub;

    if (!dentistId) {
      return NextResponse.json(createResponse(false, "Unauthorized", null), {
        status: 401,
      });
    }

    const reportId = req.nextUrl.pathname.split("/").pop();

    if (!reportId || !isValidCuid(reportId)) {
      return NextResponse.json(
        createResponse(false, "Invalid Report Id.", null),
        { status: 400 },
      );
    }

    const report = await prisma.report.findUnique({
      where: { id: reportId },
    });

    if (!report) {
      return NextResponse.json(
        createResponse(false, "Report with this Id does not exist.", null),
        { status: 404 },
      );
    }

    if (report.dentistId === dentistId) {
      await prisma.report.delete({
        where: { id: reportId },
      });
      return NextResponse.json(
        createResponse(true, "Report deleted successfully.", null),
        { status: 200 },
      );
    } else {
      return NextResponse.json(
        createResponse(false, "Unauthorized to delete this report.", null),
        { status: 403 },
      );
    }
  } catch (error) {
    console.log("Error in deleting report ", error);
    const errorMessage = error instanceof Error ? error.message : String(error);
    return NextResponse.json(createResponse(false, errorMessage, null), {
      status: 500,
    });
  }
}
