import prisma from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";
import { createResponse } from "@/utils/createResponse";
import { DentistRole, ReferralRequestStatus } from "@prisma/client";
import { getToken } from "next-auth/jwt";
import { TokenRoles } from "@/constants/UserRoles";
import { getPatient } from "@/dentallyHelpers/patient";

/**
 * @swagger
 * /api/referrals:
 *   post:
 *     summary: Create a referral form and request
 *     tags: [Referrals]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               medicalHistoryPdfUrl:
 *                 type: string
 *               referralDetails:
 *                 type: array
 *                 items:
 *                   type: string
 *               treatmentDetails:
 *                 type: string
 *               patientDateOfBirth:
 *                 type: string
 *                 format: date-time
 *               patientAddress:
 *                 type: string
 *               patientEmail:
 *                 type: string
 *               patientPhoneNumber:
 *                 type: string
 *               patientFirstName:
 *                 type: string
 *               patientLastName:
 *                 type: string
 *               other:
 *                 type: string
 *               referralPracticeNameAddress:
 *                 type: string
 *               referralEmail:
 *                 type: string
 *               referralGDC:
 *                 type: string
 *               referralPhoneNumber:
 *                 type: string
 *               referralName:
 *                 type: string
 *               attendTreatment:
 *                 type: string
 *             example:
 *               patientFirstName: John 
 *               patientLastName: Doe
 *               patientEmail: john.doe@example.com
 *               patientPhoneNumber: "+44 7700 900123"
 *               patientAddress: 10 High Street, London, SW1A 1AA
 *               patientDateOfBirth: "1990-04-15T00:00:00Z"
 *               referralName: Dr Jane Smith
 *               referralEmail: jane.smith@practice.example.com
 *               referralPhoneNumber: "+44 20 7946 0999"
 *               referralGDC: "123456"
 *               referralPracticeNameAddress: "Smile Dental, 22 King Road, London"
 *               attendTreatment: "Yes"
 *               referralDetails:
 *                 - "Lower left molar pain"
 *                 - "Requires endodontic assessment"
 *               treatmentDetails: "Suspected caries on 36"
 *               medicalHistoryPdfUrl: "https://example.com/medical-history/john-doe.pdf"
 *               other: "Patient prefers morning appointments"
 *     responses:
 *       201:
 *         description: Form created successfully
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               message: "Form created successfully."
 *               data:
 *                 id: "ref_01HXYZ1234ABCDE"
 *                 patientName: "John Doe"
 *                 patientEmail: "john.doe@example.com"
 *                 referralName: "Dr Jane Smith"
 *                 referralEmail: "jane.smith@practice.example.com"
 *                 referralGDC: "123456"
 *                 referralDentistId: "dent_01HXYZ1234ABCDE"
 *       500:
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             example:
 *               status: false
 *               message: "Internal Server Error"
 *               data: null
 *   get:
 *     summary: Get referral forms for the authenticated dentist
 *     tags: [Referrals]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Referral forms fetched successfully
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               message: "Referral forms fetched successfully."
 *               data:
 *                 - id: "ref_01HXYZ1234ABCDE"
 *                   patientName: "John Doe"
 *                   referralName: "Dr Jane Smith"
 *                   referralEmail: "jane.smith@practice.example.com"
 *                   referralGDC: "123456"
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
 *         description: Dentist doesn't have any referral form
 *         content:
 *           application/json:
 *             example:
 *               status: false
 *               message: "Dentist don't have any referrel form"
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
export async function POST(req: NextRequest) {
  const referralForm = await req.json();
  try {
    const patientFirstName = referralForm.patientFirstName
    const patientLastName = referralForm.patientLastName

    if (!patientFirstName || !patientLastName) {
      return NextResponse.json(
        createResponse(false, "Patient first and last name is required", null),
        { status: 400 },
      );
    }

    const response = await getPatient({ firstName: patientFirstName, lastName: patientLastName });

    let patient = null;
    if (response.isError) {
      return NextResponse.json(
        createResponse(false, "Dentally Error", null),
        { status: 400 },
      );
    }

    const activePatients = (response.response.patients ?? []).filter(
      (patient: any) => patient.active && !patient.archivedReason,
    );

    if (activePatients.length === 0 || activePatients.length > 1) {
      return NextResponse.json(
        createResponse(
          false,
          "No Account found",
          null,
        ),
        { status: 404 },
      );
    }

    let active = activePatients[0];
    const patientFullName = `${active.firstName} ${active.lastName}`
    referralForm.patientName = patientFullName;
    delete referralForm.patientFirstName;
    delete referralForm.patientLastName;

    let dbPatient = await prisma.patient.findUnique({ where: { dentallyId: active.id } })
    if (!dbPatient) {
      dbPatient = await prisma.patient.create({
        data: {
          uuid: active.uuid,
          dentallyId: active.id,
          mobileNumber: active.mobilePhone,
          email: active.emailAddress,
          name: patientFullName,
          dateOfBirth: active.dateOfBirth,
          familyId: active.familyId,
        },
      });
    }

    if (patient) {
      referralForm.patientId = dbPatient.id;
    }

    const referralEmail = referralForm.referralEmail;
    const referralDentist = await prisma.dentist.findUnique({
      where: { email: referralEmail, role: DentistRole.REFERRING_DENTIST },
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
      { status: 201 },
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
      token.role === TokenRoles.DENTALLY_PRACTITIONER
    ) {
      return NextResponse.json(createResponse(false, "Forbidden", null), {
        status: 403,
      });
    }

    let dentistId = null;
    if (
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
        { status: 404 },
      );
    }

    return NextResponse.json(
      createResponse(
        true,
        "Referral forms fetched successfully.",
        referralForms,
      ),
      { status: 200 },
    );
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    return NextResponse.json(createResponse(false, errorMessage, null), {
      status: 500,
    });
  }
}
