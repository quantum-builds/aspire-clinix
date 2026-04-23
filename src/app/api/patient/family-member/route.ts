import { createResponse } from "@/utils/createResponse";
import { NextRequest, NextResponse } from "next/server";
import { getPatient } from "@/dentallyHelpers/patient";
import prisma from "@/lib/db";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const email = searchParams.get("email")?.trim() || "";
    const familyId = searchParams.get("familyId")?.trim() || "";
    const firstName = searchParams.get("firstName")?.trim() || "";
    const lastName = searchParams.get("lastName")?.trim() || "";
    const dateOfBirth = searchParams.get("dateOfBirth")?.trim() || "";
    const otp = searchParams.get("otp")?.trim() || "";

    if (!email || !familyId) {
      return NextResponse.json(
        createResponse(false, "email and familyId are required", null),
        {
          status: 400,
        },
      );
    }

    const response = await getPatient({
      emailAddress: email,
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

    const existingPatient = await prisma.patient.findFirst({
      where: {
        dentallyId: activePatients?.dentallyId,
      },
    });
    let patient = null;

    if (!existingPatient) {
      patient = await prisma.patient.create({
        data: {
          id: activePatients?.id,
          uuid: activePatients?.uuid,
          dentallyId: activePatients?.dentallyId,
          email: email,
          familyId: familyId,
          firstName: firstName,
          lastName: lastName,
          dateOfBirth: dateOfBirth,
          otp: otp,
          otpInvalidationTime: new Date(Date.now() + 15 * 60 * 1000),
        },
      });
    } else {
      patient = await prisma.patient.update({
        where: { id: activePatients?.id },
        data: {
          email: email,
          familyId: familyId,
        },
      });
    }

    return NextResponse.json(
      createResponse(
        true,
        "Family members fetched successfully",
        response.response,
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
