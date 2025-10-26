import prisma from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";
import { createResponse } from "@/utils/createResponse";
import { DentistRole, ReferralRequestStatus } from "@prisma/client";
import { getToken } from "next-auth/jwt";
import { TokenRoles } from "@/constants/UserRoles";

export async function POST(req: NextRequest) {

  const referralForm = await req.json();
  try {
    const patientEmail = referralForm.patientEmail;
    console.log("patient email", patientEmail)
    const patient = await prisma.patient.findUnique({
      where: { email: patientEmail },
    });

    console.log("patient", patient)


    const referralEmail = referralForm.referralEmail;
    console.log("referral email", referralEmail)

    const referralDentist = await prisma.dentist.findUnique({
      where: { email: referralEmail },
    });

    console.log("referral ", referralDentist)


    if (referralDentist) {
      if (referralDentist.role === DentistRole.RECIEVING_DENTIST) {
        await prisma.dentist.update({
          where: { id: referralDentist.id },
          data: { role: DentistRole.DENTIST },
        });
      }
      referralForm.referralDentistId = referralDentist.id;
    }

    if (patient) {
      referralForm.patientId = patient.id;
    }

    console.log("Referral form is ", referralForm)
    const referral = await prisma.$transaction(async (tx) => {
      const newReferral = await tx.referralForm.create({
        data: referralForm,
        include: {
          referralDentist: true,
          patient: true
        }
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
    console.log("Error in creating referral form ", error);
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
    console.log("Error in fetching referral forms ", error);
    const errorMessage = error instanceof Error ? error.message : String(error);
    return NextResponse.json(createResponse(false, errorMessage, null), {
      status: 500,
    });
  }
}
