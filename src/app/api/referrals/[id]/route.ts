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
 *       400:
 *         description: Invalid Form Id
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Referral form does not exist
 *       500:
 *         description: Internal Server Error
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
 *     responses:
 *       200:
 *         description: Referral form updated successfully
 *       400:
 *         description: Invalid Form Id
 *       500:
 *         description: Internal Server Error
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
 *       400:
 *         description: Invalid Form Id
 *       404:
 *         description: Referral form does not exist
 *       500:
 *         description: Internal Server Error
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
