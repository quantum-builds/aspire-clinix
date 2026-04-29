import { createResponse } from "@/utils/createResponse";
import { NextRequest, NextResponse } from "next/server";
import { getPatient } from "@/dentallyHelpers/patient";
import prisma from "@/lib/db";

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
    const { searchParams } = new URL(req.url);
    const familyId = searchParams.get("familyId")?.trim() || "";

    if (!familyId) {
      return NextResponse.json(
        createResponse(false, "FamilyId is required", null),
        {
          status: 400,
        },
      );
    }

    const response = await getPatient({
      familyId,
    });

    if (response.isError) {
      return response.response;
    }

    const activePatients = response.response.filter(
      (patient: any) => patient.active && !patient.archived_reason,
    );

    if (activePatients.length === 0) {
      throw new Error("No account found");
    }

    await Promise.all(
      activePatients.map(async (activePatient: any) => {
        const existingPatient = await prisma.patient.findFirst({
          where: {
            dentallyId: activePatient?.dentallyId,
          },
        });

        if (!existingPatient) {
          await prisma.patient.create({
            data: {
              id: activePatient?.id,
              uuid: activePatient?.uuid,
              dentallyId: activePatient?.dentallyId,
              familyId,
            },
          });
        }
      }),
    );

    return NextResponse.json(
      createResponse(
        true,
        "Family members fetched successfully",
        activePatients,
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
