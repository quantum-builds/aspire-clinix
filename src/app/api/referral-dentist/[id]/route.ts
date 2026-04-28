import prisma from "@/lib/db";
import { createResponse } from "@/utils/createResponse";
import { isValidCuid } from "@/utils/typeValidUtils";
import { NextRequest, NextResponse } from "next/server";

/**
 * @swagger
 * /api/referral-dentist/{id}:
 *   patch:
 *     summary: Update a referral dentist by ID
 *     tags: [Referral Dentist]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Dentist ID (CUID)
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               gdcNo:
 *                 type: string
 *               dentallyId:
 *                 type: string
 *               firstName:
 *                 type: string
 *               lastName:
 *                 type: string
 *               appointmentIds:
 *                 type: array
 *                 items:
 *                   type: string
 *             example:
 *               email: dentist@example.com
 *               gdcNo: GDC123456
 *               dentallyId: DENTALLY-001
 *               firstName: Sarah
 *               lastName: Ahmed
 *               appointmentIds:
 *                 - appt_01HZYABC123
 *                 - appt_01HZYABC456
 *     responses:
 *       200:
 *         description: Dentist updated successfully
 *       400:
 *         description: Invalid Dentist Id
 *       500:
 *         description: Internal Server Error
 */
export async function PATCH(req: NextRequest) {
  try {
    // const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

    // if (!token || token.role !== "admin") {
    //   return NextResponse.json(createResponse(false, "Unauthorized", null), {
    //     status: 401,
    //   });
    // }

    const dentistId = req.nextUrl.pathname.split("/").pop();

    if (!dentistId || !isValidCuid(dentistId)) {
      return NextResponse.json(
        createResponse(false, "Invalid Dentist Id.", null),
        { status: 400 },
      );
    }

    const updatedDentist = await req.json();

    await prisma.dentist.update({
      where: { id: dentistId },
      data: updatedDentist,
    });

    return NextResponse.json(
      createResponse(true, "Dentist updated successfully.", null),
      { status: 200 },
    );
  } catch (error) {
    console.log("Error in updating dentist ", error);
    const errorMessage = error instanceof Error ? error.message : String(error);
    return NextResponse.json(createResponse(false, errorMessage, null), {
      status: 500,
    });
  }
}
