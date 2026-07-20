import { TokenRoles } from "@/constants/UserRoles";
import prisma from "@/lib/db";
import { createResponse } from "@/utils/createResponse";
import { isValidCuid } from "@/utils/typeValidUtils";
import { getToken } from "next-auth/jwt";
import type { JWT } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";
import { DentistRole, ReferralRequestStatus } from "@prisma/client";
import { gettPractitionerById } from "@/dentallyHelpers/practitioners";
import { getAppointment } from "@/dentallyHelpers/appointment";
import ReferralForm from "@/components/ReferralForm";
import { notifyReferralAppointmentBound, notifyReferralDentistAssigned } from "@/notifications/referralNotifications";

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
async function resolveDentistFromToken(
  token: JWT,
): Promise<{ localDentistId: string | null; role: string | null }> {
  if (!token.sub) return { localDentistId: null, role: token.role as string };

  if (token.role === TokenRoles.DENTALLY_PRACTITIONER) {
    const dentallyId = Number(token.sub);
    if (!Number.isNaN(dentallyId)) {
      const dentist = await prisma.dentist.findFirst({
        where: { dentallyId },
        select: { id: true },
      });
      return {
        localDentistId: dentist?.id ?? null,
        role: token.role as string,
      };
    }
  }

  return { localDentistId: String(token.sub), role: token.role as string };
}

export async function GET(req: NextRequest) {
  try {
    const token = await getToken({ req });

    if (!token) {
      return NextResponse.json(createResponse(false, "Unauthorized", null), {
        status: 401,
      });
    }

    if (token.role === TokenRoles.PATIENT) {
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
        referralForm: {
          include: {
            patient: true,
            referralDentist: true,
          },
        },
      },
    });

    if (!existingRequest) {
      return NextResponse.json(
        createResponse(false, "Referral Request does not exist.", null),
        { status: 404 },
      );
    }

    // DENTALLY_PRACTITIONER can only view referrals assigned to them
    if (token.role === TokenRoles.DENTALLY_PRACTITIONER) {
      const { localDentistId } = await resolveDentistFromToken(token as JWT);
      if (
        !localDentistId ||
        existingRequest.assignedDentistId !== localDentistId
      ) {
        return NextResponse.json(createResponse(false, "Forbidden", null), {
          status: 403,
        });
      }
    }

    let assignedDentist = null;
    if (existingRequest.assignedDentistId) {
      assignedDentist = await prisma.dentist.findUnique({
        where: { id: existingRequest.assignedDentistId },
      });
    }

    let appointment = null;
    if (existingRequest.appointmentId) {
      try {
        const aptRes = await getAppointment(existingRequest.appointmentId);
        if (!aptRes.isError && aptRes.response?.appointment) {
          appointment = aptRes.response.appointment;
        }
      } catch (e) {
        console.error("Failed to fetch appointment from Dentally:", e);
      }
    }

    const responseData = {
      ...existingRequest,
      assignedDentist,
      appointment,
    };

    return NextResponse.json(
      createResponse(
        true,
        "Referral request fetched successfully.",
        responseData,
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

async function findOrCreateDentistFromPractitioner(
  practitionerId: number,
): Promise<string> {
  const existingDentist = await prisma.dentist.findFirst({
    where: { dentallyId: practitionerId },
  });

  if (existingDentist) {
    return existingDentist.id;
  }

  let firstName = "";
  let lastName = "";
  let email = "";
  let gdcNo = "";

  try {
    const practitionerRes = await gettPractitionerById(String(practitionerId));
    if (!practitionerRes.isError && practitionerRes.response?.practitioner) {
      const prac = practitionerRes.response.practitioner;
      firstName = prac.user.firstName || "";
      lastName = prac.user.lastName || "";
      email = prac.user.email || "";
      gdcNo = prac.gdcNumber || "";
    }
  } catch (e) {
    console.error("Failed to fetch practitioner from Dentally:", e);
  }

  const newDentist = await prisma.dentist.create({
    data: {
      email: email || `dentist+${practitionerId}@aspire-clinic.com`,
      firstName: firstName || "Unknown",
      lastName: lastName || "",
      gdcNo: gdcNo,
      dentallyId: practitionerId,
      role: DentistRole.DENTALLY_PRACTITIONER,
      otp: undefined,
      otpInvalidationTime: undefined,
    },
  });

  return newDentist.id;
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
      return NextResponse.json(createResponse(false, "Forbidden", null), {
        status: 403,
      });
    }

    const referralRequestId = req.nextUrl.pathname.split("/").pop();
    const body = await req.json();

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

    const { appointmentId, requestStatus, practitionerId, assignedDentistId, actionType } =
      body;


    // --- PURE ASSIGNMENT (no appointmentId) ---
    if (requestStatus === "PENDING_REVIEW") {
      let resolvedDentistId = assignedDentistId;

      if (practitionerId && !resolvedDentistId) {
        resolvedDentistId = await findOrCreateDentistFromPractitioner(
          Number(practitionerId),
        );
      }

      if (!resolvedDentistId) {
        return NextResponse.json(
          createResponse(
            false,
            "assignedDentistId or practitionerId is required for assignment.",
            null,
          ),
          { status: 400 },
        );
      }

      const updated = await prisma.referralRequest.update({
        where: { id: referralRequestId },
        data: {
          assignedDentistId: resolvedDentistId,
          requestStatus: ReferralRequestStatus.PENDING_REVIEW,
          dentistResponseStatus: "PENDING",
          appointmentId: null,
          dentistComments: null,
          proposedTreatmentDetails: null,
          proposedConsultationTime: null,
          respondedAt: null,
        },
      });

      if (actionType === "DENTIST_ASSIGN") {
        notifyReferralDentistAssigned(referralRequestId).catch(console.error);
      }

      return NextResponse.json(
        createResponse(true, "Referral assigned successfully.", updated),
        { status: 200 },
      );
    }

    // --- UNASSIGN (clear all) ---
    if (requestStatus === "UNASSIGNED") {
      const data: any = {
        requestStatus: ReferralRequestStatus.UNASSIGNED,
        assignedDentistId: null,
        appointmentId: null,
        dentistResponseStatus: null,
        dentistComments: null,
        proposedTreatmentDetails: null,
        proposedConsultationTime: null,
        respondedAt: null,
      };

      const updated = await prisma.referralRequest.update({
        where: { id: referralRequestId },
        data,
      });

      return NextResponse.json(
        createResponse(true, "Referral unassigned successfully.", updated),
        { status: 200 },
      );
    }

    // --- BIND APPOINTMENT (existing flow) ---
    if (requestStatus === "ASSIGNED") {
      if (!appointmentId) {
        return NextResponse.json(
          createResponse(
            false,
            "appointmentId is required to bind an appointment.",
            null,
          ),
          { status: 400 },
        );
      }

      let resolvedDentistId: string | undefined;

      if (practitionerId) {
        resolvedDentistId = await findOrCreateDentistFromPractitioner(
          Number(practitionerId),
        );
      }

      const updateData: any = {
        appointmentId,
        requestStatus: ReferralRequestStatus.ASSIGNED,
      };

      if (resolvedDentistId) {
        updateData.assignedDentistId = resolvedDentistId;
      }

      await prisma.referralRequest.update({
        where: { id: referralRequestId },
        data: updateData,
      });

      

      
      const result = await prisma.referralRequest.findUnique({
        where: { id: referralRequestId },
        include: {
          referralForm: {
            include: {
              patient: true,
              referralDentist: true,
            },
          },
        },
      });

      const dentist = result?.assignedDentistId
        ? await prisma.dentist.findUnique({
            where: { id: result.assignedDentistId },
          })
        : null;

      if (actionType === "APPOINTMENT_BIND") {
        notifyReferralAppointmentBound(referralRequestId).catch(console.error);
      }

      return NextResponse.json(
        createResponse(true, "Appointment bound successfully.", {
          ...result,
          assignedDentist: dentist,
        }),
        { status: 200 },
      );
    }

    return NextResponse.json(
      createResponse(
        false,
        "Invalid requestStatus. Must be PENDING_REVIEW, UNASSIGNED, or ASSIGNED.",
        null,
      ),
      { status: 400 },
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
      createResponse(true, "Referral deleted successfully.", null),
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
