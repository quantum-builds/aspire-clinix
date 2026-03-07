import prisma from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";
import { createResponse } from "@/utils/createResponse";
import { ReferralRequestStatus } from "@prisma/client";
import { getToken } from "next-auth/jwt";
import { TokenRoles } from "@/constants/UserRoles";
import { getPatient } from "@/dentallyHelpers/patient";

export async function POST(req: NextRequest) {

  const referralForm = await req.json();
  try {
    const patientEmail = referralForm.patientEmail;

    const respose = await getPatient({ emailAddress: patientEmail })
    
    let patient = null
    if (!respose.isError) {
      patient = respose.response
    }
    if (patient) {
      referralForm.patientId = patient.id;
    }

    const referralEmail = referralForm.referralEmail;

    const referralDentist = await prisma.dentist.findUnique({
      where: { email: referralEmail },
    });

    if (referralDentist) {
      referralForm.referralDentistId = referralDentist.id;
    }



    const referral = await prisma.$transaction(async (tx) => {
      const newReferral = await tx.referralForm.create({
        data: referralForm,
      });

      await tx.referralRequest.create({
        data: {
          referralFormId: newReferral.id,
          requestStatus: ReferralRequestStatus.UNASSIGNED,
        },
      });
      return newReferral;
    });

    return NextResponse.json(
      createResponse(true, "Form created successfully.", referral),
      { status: 201 }
    );
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    return NextResponse.json(createResponse(false, errorMessage, null), {
      status: 500,
    });
  }
}

export async function GET(req: NextRequest) {
  try {
    const token = await getToken({ req });

    if (!token) {
      return NextResponse.json(createResponse(false, "Unauthorized", null), {
        status: 401,
      });
    }

    if (
      token.role === TokenRoles.PATIENT ||
      token.role === TokenRoles.RECIEVING_DENTIST
    ) {
      return NextResponse.json(createResponse(false, "Forbidden", null), {
        status: 403,
      });
    }

    let dentistId = null;
    if (
      token.role === TokenRoles.DENTIST ||
      token.role === TokenRoles.REFERRING_DENTIST
    ) {
      dentistId = token.sub;
    }

    const referralForms = await prisma.referralForm.findMany({
      where: { referralDentistId: dentistId },
    });

    if (referralForms.length === 0) {
      return NextResponse.json(
        createResponse(false, "Dentist don't have any referrel form", null),
        { status: 404 }
      );
    }

    return NextResponse.json(
      createResponse(
        true,
        "Referral forms fetched successfully.",
        referralForms
      ),
      { status: 200 }
    );
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    return NextResponse.json(createResponse(false, errorMessage, null), {
      status: 500,
    });
  }
}
