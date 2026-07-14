import { TokenRoles } from "@/constants/UserRoles";
import prisma from "@/lib/db";
import { createResponse } from "@/utils/createResponse";
import { isValidCuid } from "@/utils/typeValidUtils";
import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const token = await getToken({ req });

    if (!token) {
      return NextResponse.json(createResponse(false, "Unauthorized", null), {
        status: 401,
      });
    }

    if (token.role !== TokenRoles.DENTALLY_PRACTITIONER) {
      return NextResponse.json(createResponse(false, "Forbidden", null), {
        status: 403,
      });
    }

    const referralRequestId = req.nextUrl.pathname.split("/").pop();

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

    if (referral.requestStatus !== "PENDING_REVIEW") {
      return NextResponse.json(
        createResponse(
          false,
          "You can only respond to referrals that are pending review.",
          null,
        ),
        { status: 400 },
      );
    }

    const dentallyId = Number(token.sub);
    if (Number.isNaN(dentallyId)) {
      return NextResponse.json(createResponse(false, "Invalid token.", null), {
        status: 401,
      });
    }

    const dentist = await prisma.dentist.findFirst({
      where: { dentallyId },
      select: { id: true },
    });

    if (!dentist || referral.assignedDentistId !== dentist.id) {
      return NextResponse.json(
        createResponse(
          false,
          "This referral is not assigned to you.",
          null,
        ),
        { status: 403 },
      );
    }

    const body = await req.json();
    const { action, comments, proposedTreatmentDetails, proposedConsultationTime } = body;

    if (!action || !["ACCEPTED", "REJECTED"].includes(action)) {
      return NextResponse.json(
        createResponse(
          false,
          "action is required and must be ACCEPTED or REJECTED.",
          null,
        ),
        { status: 400 },
      );
    }

    const updateData: any = {
      dentistResponseStatus: action,
      dentistComments: comments || null,
      proposedTreatmentDetails: proposedTreatmentDetails || null,
      proposedConsultationTime: proposedConsultationTime || null,
      respondedAt: new Date(),
    };

    if (action === "ACCEPTED") {
      updateData.requestStatus = "ACCEPTED";
    } else if (action === "REJECTED") {
      updateData.requestStatus = "REJECTED";
    }

    const updated = await prisma.referralRequest.update({
      where: { id: referralRequestId },
      data: updateData,
    });

    return NextResponse.json(
      createResponse(true, `Referral ${action.toLowerCase()} successfully.`, updated),
      { status: 200 },
    );
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    return NextResponse.json(createResponse(false, errorMessage, null), {
      status: 500,
    });
  }
}
