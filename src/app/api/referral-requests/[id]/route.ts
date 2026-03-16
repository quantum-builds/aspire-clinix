import { TokenRoles } from "@/constants/UserRoles";
import prisma from "@/lib/db";
import { createResponse } from "@/utils/createResponse";
import { isValidCuid } from "@/utils/typeValidUtils";
import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";
import { tuple } from "zod";

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
      createResponse(true,"Referral deleted successfully.", null),
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
