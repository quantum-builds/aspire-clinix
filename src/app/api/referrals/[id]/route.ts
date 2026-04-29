import { NextResponse, NextRequest } from "next/server";
import prisma from "@/lib/db";
import { isValidCuid } from "@/utils/typeValidUtils";
import { getToken } from "next-auth/jwt";
import { createResponse } from "@/utils/createResponse";
import { TokenRoles } from "@/constants/UserRoles";
import { getPatientById } from "@/dentallyHelpers/patient";

/**
 * @swagger
 * /api/referrals/{id}:
 *   get:
 *     summary: Get a referral form by ID
 *     tags: [Referrals]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Referral form ID (CUID)
 *     responses:
 *       200:
 *         description: Referral form fetched successfully
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               message: "Referral form fetched successfully."
 *               data:
 *                 referralForm:
 *                   id: "ref_01HXYZ1234ABCDE"
 *                   patientName: "John Doe"
 *                   referralName: "Dr Jane Smith"
 *                   referralEmail: "jane.smith@practice.example.com"
 *                 patient:
 *                   id: "pat_01HXYZ1234ABCDE"
 *                   email: "john.doe@example.com"
 *       400:
 *         description: Invalid Form Id
 *         content:
 *           application/json:
 *             example:
 *               status: false
 *               message: "Invalid Form Id."
 *               data: null
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
 *         description: Referral form does not exist
 *         content:
 *           application/json:
 *             example:
 *               status: false
 *               message: "Referral form with this Id does not exists."
 *               data: null
 *       500:
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             example:
 *               status: false
 *               message: "Internal Server Error"
 *               data: null
 *   put:
 *     summary: Update a referral form by ID
 *     tags: [Referrals]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Referral form ID (CUID)
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *           example:
 *             patientName: "John Doe"
 *             patientEmail: "john.doe@example.com"
 *             patientPhoneNumber: "+44 7700 900123"
 *             patientAddress: "10 High Street, London, SW1A 1AA"
 *             patientDateOfBirth: "1990-04-15T00:00:00Z"
 *             referralName: "Dr Jane Smith"
 *             referralEmail: "jane.smith@practice.example.com"
 *             referralPhoneNumber: "+44 20 7946 0999"
 *             referralGDC: "123456"
 *             referralPracticeNameAddress: "Smile Dental, 22 King Road, London"
 *             attendTreatment: "Yes"
 *             referralDetails:
 *               - "Lower left molar pain"
 *               - "Requires endodontic assessment"
 *             treatmentDetails: "Suspected caries on 36"
 *             medicalHistoryPdfUrl: "https://example.com/medical-history/john-doe.pdf"
 *             other: "Patient prefers morning appointments"
 *     responses:
 *       200:
 *         description: Referral form updated successfully
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               message: "Referral form updated successfully.."
 *               data: null
 *       400:
 *         description: Invalid Form Id
 *         content:
 *           application/json:
 *             example:
 *               status: false
 *               message: "Invalid Form Id."
 *               data: null
 *       500:
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             example:
 *               status: false
 *               message: "Internal Server Error"
 *               data: null
 *   delete:
 *     summary: Delete a referral form by ID
 *     tags: [Referrals]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Referral form ID (CUID)
 *     responses:
 *       200:
 *         description: Referral deleted successfully
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               message: "Referral deleted successfully."
 *               data: null
 *       400:
 *         description: Invalid Form Id
 *         content:
 *           application/json:
 *             example:
 *               status: false
 *               message: "Invalid Form Id."
 *               data: null
 *       404:
 *         description: Referral form does not exist
 *         content:
 *           application/json:
 *             example:
 *               status: false
 *               message: "Referral form with this Id does not exists."
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
  const referralFormId = req.nextUrl.pathname.split("/").pop();

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

    if (!referralFormId || !isValidCuid(referralFormId)) {
      return NextResponse.json(
        createResponse(false, "Invalid Form Id.", null),
        { status: 400 },
      );
    }

    const referralForm = await prisma.referralForm.findUnique({
      where: { id: referralFormId },
      include: { referralDentist: true, referralRequest: true },
    });

    if (!referralForm) {
      return NextResponse.json(
        createResponse(
          false,
          "Referral form with this Id does not exists.",
          null,
        ),
        { status: 404 },
      );
    }

    let patient = null;
    if (referralForm.patientId) {
      const respose = await getPatientById(referralForm?.patientId);
      if (respose.isError) {
        return respose.response;
      }
      patient = respose.response;
    }

    return NextResponse.json(
      createResponse(true, "Referral form fetched successfully.", {
        referralForm,
        patient,
      }),
      { status: 200 },
    );
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    return NextResponse.json(createResponse(false, errorMessage, null), {
      status: 500,
    });
  }
}

export async function PUT(req: NextRequest) {
  const referralFormId = req.nextUrl.pathname.split("/").pop();

  if (!referralFormId || !isValidCuid(referralFormId)) {
    return NextResponse.json(createResponse(false, "Invalid Form Id.", null), {
      status: 400,
    });
  }

  try {
    const updateReferralForm = await req.json();

    await prisma.referralForm.update({
      where: { id: referralFormId },
      data: updateReferralForm,
    });

    return NextResponse.json(
      createResponse(true, "Referral form updated successfully..", null),
      { status: 200 },
    );
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    return NextResponse.json(createResponse(false, errorMessage, null), {
      status: 500,
    });
  }
}

export async function DELETE(req: NextRequest) {
  const referralFormId = req.nextUrl.pathname.split("/").pop();

  try {
    if (!referralFormId || !isValidCuid(referralFormId)) {
      return NextResponse.json(
        createResponse(false, "Invalid Form Id.", null),
        { status: 400 },
      );
    }

    const referralForm = await prisma.referralForm.findUnique({
      where: { id: referralFormId },
    });

    if (!referralForm) {
      return NextResponse.json(
        createResponse(
          false,
          "Referral form with this Id does not exists.",
          null,
        ),
        { status: 404 },
      );
    }

    await prisma.referralForm.delete({
      where: { id: referralFormId },
    });

    return NextResponse.json(
      createResponse(true, "Referral deleted successfully.", null),
      { status: 200 },
    );
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    return NextResponse.json(createResponse(false, errorMessage, null), {
      status: 500,
    });
  }
}
