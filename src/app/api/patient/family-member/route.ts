import { createResponse } from "@/utils/createResponse";
import { NextRequest, NextResponse } from "next/server";
import { getPatientById } from "@/dentallyHelpers/patient";
import prisma from "@/lib/db";
import { getToken } from "next-auth/jwt";
import { TokenRoles } from "@/constants/UserRoles";

/**
 * @swagger
 * /api/patient/family-member:
 *   get:
 *     summary: Get family members for a patient family ID
 *     tags: [Patient]
 *     parameters:
 *       - in: query
 *         name: familyId
 *         required: true
 *         schema:
 *           type: string
 *         description: Family ID used to fetch linked patients
 *     responses:
 *       200:
 *         description: Family members fetched successfully
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               message: "Family members fetched successfully"
 *               data:
 *                 - id: "pat_01HXYZ1234ABCDE"
 *                   dentallyId: "dent_01HXYZ1234ABCDE"
 *                   firstName: "John"
 *                   lastName: "Doe"
 *                   familyId: "fam_01HXYZ1234ABCDE"
 *       400:
 *         description: FamilyId is required
 *         content:
 *           application/json:
 *             example:
 *               status: false
 *               message: "FamilyId is required"
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

    if (token.role !== TokenRoles.PATIENT) {
      return NextResponse.json(createResponse(false, "Forbidden", null), {
        status: 403,
      });
    }

    const { searchParams } = new URL(req.url);
    const familyId = searchParams.get("familyId")?.trim() || "";
    console.log("Fetching family members for familyId:", familyId);

    if (!familyId) {
      return NextResponse.json(
        createResponse(false, "FamilyId is required", null),
        {
          status: 400,
        },
      );
    }

    const familyPatients = await prisma.patient.findMany({
      where: { familyId },
      select: { dentallyId: true },
    });

    if (familyPatients.length === 0) {
      throw new Error("No account found");
    }

    const familyMembers = (
      await Promise.all(
        familyPatients.map(async (fp) => {
          if (!fp.dentallyId) return null;
          const res = await getPatientById(String(fp.dentallyId));
          if (res.isError) return null;
          const patient = res.response.patient;
          if (
            !patient ||
            patient.archivedReason ||
            patient.familyId !== familyId
          )
            return null;
          return patient;
        }),
      )
    ).filter(Boolean);

    if (familyMembers.length === 0) {
      throw new Error("No account found");
    }

    return NextResponse.json(
      createResponse(
        true,
        "Family members fetched successfully",
        familyMembers,
      ),
      {
        status: 200,
      },
    );
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    return NextResponse.json(createResponse(false, errorMessage, null), {
      status: 500,
    });
  }
}
