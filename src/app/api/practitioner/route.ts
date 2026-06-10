import { createResponse } from "@/utils/createResponse";
import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import { TokenRoles } from "@/constants/UserRoles";
import {
  gettPractitionerById,
} from "@/dentallyHelpers/practitioners";
import prisma from "@/lib/db";

/**
 * @swagger
 * /api/practitioner:
 *   get:
 *     summary: Get practitioner data
 *     tags: [Practitioner]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Practitioner fetched successfully
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               message: "Practitioner fetched successfully"
 *               data:
 *                 id: "prac_01HXYZ1234ABCDE"
 *                 dentallyId: "dent_01HXYZ1234ABCDE"
 *                 email: "dentist@example.com"
 *                 gdcNo: "GDC123456"
 *                 firstName: "Sarah"
 *                 lastName: "Ahmed"
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             example:
 *               status: false
 *               message: "Unauthorized"
 *               data: null
 *       403:
 *         description: Forbidden
 *         content:
 *           application/json:
 *             example:
 *               status: false
 *               message: "Forbidden"
 *               data: null
 *       404:
 *         description: No practitioner found
 *         content:
 *           application/json:
 *             example:
 *               status: false
 *               message: "No Practitioner found"
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

    if (!token) {
      return NextResponse.json(createResponse(false, "Unauthorized", null), {
        status: 401,
      });
    }

    if (token.role === TokenRoles.DENTALLY_PRACTITIONER) {
      const dentistDentallyId = token.sub ?? "";

      const respose = await gettPractitionerById(dentistDentallyId);
      if (respose.isError) {
        return respose.response;
      }
      const practitioner = respose.response.practitioner;

      if (!practitioner) {
        return NextResponse.json(
          createResponse(false, "Practitioner not found", null),
          { status: 404 },
        );
      }

      return NextResponse.json(
        createResponse(true, "Practitioner fetched successfully", practitioner),
        { status: 200 },
      );
    } else if (token.role === TokenRoles.REFERRING_DENTIST) {
      const dentistId = token.sub ?? ""

      const referralDentist = await prisma.dentist.findUnique({ where: { id: dentistId } })
      if (!referralDentist) {
        return NextResponse.json(
          createResponse(false, "Practitioner not found", null),
          { status: 404 },
        );
      }

      return NextResponse.json(
        createResponse(true, "Practitioner fetched successfully", referralDentist),
        { status: 200 },
      );
    } else if (token.role === TokenRoles.ADMIN) {
      const dentists = await prisma.dentist.findMany({})
      if (!dentists || dentists.length === 0) {
        return NextResponse.json(
          createResponse(false, "Practitioners not found", null),
          { status: 404 },
        );
      }

      return NextResponse.json(
        createResponse(true, "Practitioners fetched successfully", dentists),
        { status: 200 },
      );
    } else {
      return NextResponse.json(createResponse(false, "Forbidden", null), {
        status: 403,
      });
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    return NextResponse.json(createResponse(false, errorMessage, null), {
      status: 500,
    });
  }
}
