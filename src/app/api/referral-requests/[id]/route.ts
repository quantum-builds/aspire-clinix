import { TokenRoles } from "@/constants/UserRoles";
import prisma from "@/lib/db";
import { createResponse } from "@/utils/createResponse";
import { isValidCuid } from "@/utils/typeValidUtils";
import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";

/**
 * @swagger
 * /api/referral-requests/{id}:
 *   get:
 *     summary: Get a referral request by ID
 *     tags: [Referral Requests]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Referral request ID (CUID)
 *     responses:
 *       200:
 *         description: Referral request fetched successfully
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               message: "Referral request fetched successfully."
 *               data:
 *                 id: "ref_01HXYZ1234ABCDE"
 *                 referralFormId: "form_01HXYZ1234ABCDE"
 *                 requestStatus: "ASSIGNED"
 *                 assignedDentistId: "dent_01HXYZ1234ABCDE"
 *                 appointments: []
 *       400:
 *         description: Invalid Referral Request
 *         content:
 *           application/json:
 *             example:
 *               status: false
 *               message: "Invalid Referral Request."
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
 *         description: Referral request does not exist
 *         content:
 *           application/json:
 *             example:
 *               status: false
 *               message: "Referral Request does not exist."
 *               data: null
 *       500:
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             example:
 *               status: false
 *               message: "Internal Server Error"
 *               data: null
 *   patch:
 *     summary: Update a referral request by ID
 *     tags: [Referral Requests]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Referral request ID (CUID)
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               requestStatus:
 *                 type: string
 *                 description: Updated referral request status
 *               assignedDentistId:
 *                 type: string
 *                 description: CUID of the assigned dentist
 *               appointmentId:
 *                 type: string
 *                 description: CUID of the linked appointment
 *             example:
 *               requestStatus: ASSIGNED
 *               assignedDentistId: ckv9q1x2y0000abcd1234efgh
 *               appointmentId: ckv9q9m3p0001abcd5678ijkl
 *     responses:
 *       200:
 *         description: Referral request updated successfully
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               message: "Referral request Updated successfully."
 *               data:
 *                 id: "ref_01HXYZ1234ABCDE"
 *                 requestStatus: "ASSIGNED"
 *                 assignedDentistId: "dent_01HXYZ1234ABCDE"
 *       400:
 *         description: Invalid Referral Request id
 *         content:
 *           application/json:
 *             example:
 *               status: false
 *               message: "Invalid Referral Request id."
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
 *               message: "FOrbidden"
 *               data: null
 *       404:
 *         description: Referral request does not exist
 *         content:
 *           application/json:
 *             example:
 *               status: false
 *               message: "Referral request does not exist."
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
 *     summary: Delete a referral request by ID
 *     tags: [Referral Requests]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Referral request ID (CUID)
 *     responses:
 *       200:
 *         description: Referral deleted successfully
 *         content:
 *           application/json:
 *             example:
 *               status: false
 *               message: "Referral deleted successfully."
 *               data: null
 *       400:
 *         description: Invalid Request Id
 *         content:
 *           application/json:
 *             example:
 *               status: false
 *               message: "Invalid Request Id."
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
 *         description: Referral request not found
 *         content:
 *           application/json:
 *             example:
 *               status: false
 *               message: "Referral request with this Id does not exists."
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

    if (
      token.role === TokenRoles.PATIENT ||
      token.role === TokenRoles.RECIEVING_DENTIST
    ) {
      return NextResponse.json(createResponse(false, "Forbidden", null), {
        status: 403,
      });
    }

    const referralRequestId = req.nextUrl.pathname.split("/").pop();

    if (!referralRequestId || !isValidCuid(referralRequestId)) {
      return NextResponse.json(
        createResponse(false, "Invalid Referral Request.", null),
        { status: 400 },
      );
    }

    const existingRequest = await prisma.referralRequest.findUnique({
      where: { id: referralRequestId },
      include: {
        referralForm: true,
        appointments: { include: { dentist: true } },
      },
    });

    if (!existingRequest) {
      return NextResponse.json(
        createResponse(false, "Referral Request does not exist.", null),
        { status: 404 },
      );
    }

    return NextResponse.json(
      createResponse(
        true,
        "Referral request fetched successfully.",
        existingRequest,
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

export async function PATCH(req: NextRequest) {
  try {
    const token = await getToken({ req });

    if (!token) {
      return NextResponse.json(createResponse(false, "Unauthorized", null), {
        status: 401,
      });
    }

    if (token.role !== TokenRoles.ADMIN) {
      return NextResponse.json(createResponse(false, "FOrbidden", null), {
        status: 403,
      });
    }
    const referralRequestId = req.nextUrl.pathname.split("/").pop();
    const partialReferralRequest = await req.json();

    if (!referralRequestId || !isValidCuid(referralRequestId)) {
      return NextResponse.json(
        createResponse(false, "Invalid Referral Request id.", null),
        { status: 400 },
      );
    }

    const referral = await prisma.referralRequest.findUnique({
      where: { id: referralRequestId },
    });

    if (!referral) {
      return NextResponse.json(
        createResponse(false, "Referral request does not exist.", null),
        { status: 404 },
      );
    }

    const updatedReferralRequest = await prisma.referralRequest.update({
      where: { id: referralRequestId },
      data: partialReferralRequest,
    });

    return NextResponse.json(
      createResponse(
        true,
        "Referral request Updated successfully.",
        updatedReferralRequest,
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

export async function DELETE(req: NextRequest) {
  const referralRequestId = req.nextUrl.pathname.split("/").pop();

  try {
    const token = await getToken({ req });

    if (!token) {
      return NextResponse.json(createResponse(false, "Unauthorized", null), {
        status: 401,
      });
    }

    if (
      token.role !== TokenRoles.ADMIN &&
      token.role !== TokenRoles.DENTIST &&
      token.role !== TokenRoles.REFERRING_DENTIST
    ) {
      return NextResponse.json(createResponse(false, "Forbidden", null), {
        status: 403,
      });
    }

    if (!referralRequestId || !isValidCuid(referralRequestId)) {
      return NextResponse.json(
        createResponse(false, "Invalid Request Id.", null),
        {
          status: 400,
        },
      );
    }

    const referralRequest = await prisma.referralRequest.findUnique({
      where: { id: referralRequestId },
      include: { referralForm: true },
    });

    if (!referralRequest) {
      return NextResponse.json(
        createResponse(
          false,
          "Referral request with this Id does not exists.",
          null,
        ),
        {
          status: 404,
        },
      );
    }

    if (
      token.role !== TokenRoles.ADMIN &&
      referralRequest.referralForm.referralDentistId != token.sub
    ) {
      return NextResponse.json(createResponse(false, "Forbidden", null), {
        status: 403,
      });
    }
    await prisma.$transaction(async (tx) => {
      // finally delete referral request
      await tx.referralRequest.delete({
        where: { id: referralRequestId },
      });

      // TODO : delete appointment if it exists

      // delete referral form if it exists
      if (referralRequest.referralFormId) {
        await tx.referralForm.delete({
          where: { id: referralRequest.referralFormId },
        });
      }
    });

    return NextResponse.json(
      createResponse(false, "Referral deleted successfully.", null),
      {
        status: 403,
      },
    );
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    return NextResponse.json(createResponse(false, errorMessage, null), {
      status: 500,
    });
  }
}
