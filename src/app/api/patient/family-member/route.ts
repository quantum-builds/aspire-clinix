import { createResponse } from "@/utils/createResponse";
import { NextRequest, NextResponse } from "next/server";
import { getPatient, getPatientById } from "@/dentallyHelpers/patient";
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
    let familyId = searchParams.get("familyId")?.trim() || "";

    if (!familyId) {
      const patientDentallyId = String(token.id ?? token.sub ?? "").trim();

      if (patientDentallyId) {
        const currentPatientResponse = await getPatientById(patientDentallyId);

        if (!currentPatientResponse.isError) {
          const currentPatient = currentPatientResponse.response ?? null;
          familyId = currentPatient?.familyId?.trim() || "";
        }
      }

      if (!familyId && token.email) {
        const currentPatientResponse = await getPatient({
          emailAddress: token.email,
        });

        if (!currentPatientResponse.isError) {
          const currentPatient =
            currentPatientResponse.response.patient ??
            currentPatientResponse.response.patients?.[0] ??
            null;

          familyId = currentPatient?.familyId?.trim() || "";
        }
      }
    }

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

    const activePatients = (response.response.patients ?? []).filter(
      (patient: any) => patient.active && !patient.archivedReason,
    );

    if (activePatients.length === 0) {
      throw new Error("No account found");
    }

    const familyMembers = await Promise.all(
      activePatients.map(async (activePatient: any) => {
        const fullName =
          `${activePatient.firstName ?? ""} ${activePatient.lastName ?? ""}`
            .trim()
            .replace(/\s+/g, " ");

        const existingPatient = await prisma.patient.findFirst({
          where: {
            dentallyId: activePatient?.dentallyId ?? activePatient?.id,
          },
        });

        const localPatient = existingPatient
          ? await prisma.patient.update({
              where: { id: existingPatient.id },
              data: {
                ...(activePatient?.imageUrl || activePatient?.fileUrl
                  ? {
                      imageUrl:
                        activePatient?.imageUrl ??
                        activePatient?.fileUrl ??
                        null,
                    }
                  : {}),
              },
            })
          : await prisma.patient.create({
              data: {
                uuid: activePatient?.uuid ?? crypto.randomUUID(),
                dentallyId: activePatient?.id,
                email: activePatient.email,
                mobileNumber: activePatient.mobilePhone,
                name: fullName,
                dateOfBirth: activePatient.dateOfBirth,
                familyId,
                imageUrl:
                  activePatient?.imageUrl ?? activePatient?.fileUrl ?? null,
              },
            });

        return {
          ...activePatient,
          id: localPatient.id,
          name: fullName,
          imageUrl: localPatient.imageUrl ?? null,
        };
      }),
    );

    console.log("family members fetched are ", familyMembers);

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
