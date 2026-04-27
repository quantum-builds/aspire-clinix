import { createResponse } from "@/utils/createResponse";
import { NextRequest, NextResponse } from "next/server";
import { getPatient } from "@/dentallyHelpers/patient";
import prisma from "@/lib/db";

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
