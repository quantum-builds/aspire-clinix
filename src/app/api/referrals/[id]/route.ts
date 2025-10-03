import { NextResponse, NextRequest } from "next/server";
import prisma from "@/lib/db";
import { isValidCuid } from "@/utils/typeValidUtils";
import { getToken } from "next-auth/jwt";
import { createResponse } from "@/utils/createResponse";
import { TokenRoles } from "@/constants/UserRoles";

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
        { status: 400 }
      );
    }

    const referralForm = await prisma.referralForm.findUnique({
      where: { id: referralFormId },
      include: { patient: true, referralDentist: true, referralRequest: true },
    });

    if (!referralForm) {
      return NextResponse.json(
        createResponse(
          false,
          "Referral form with this Id does not exists.",
          null
        ),
        { status: 404 }
      );
    }

    return NextResponse.json(
      createResponse(true, "Referral form fetched successfully.", referralForm),
      { status: 200 }
    );
  } catch (error) {
    console.log("Error in fetching referral form ", error);
    const errorMessage = error instanceof Error ? error.message : String(error);
    return NextResponse.json(createResponse(false, errorMessage, null), {
      status: 500,
    });
  }
}

export async function PUT(req: NextRequest) {
  const referralFormId = req.nextUrl.pathname.split("/").pop();

  if (!referralFormId || !isValidCuid(referralFormId)) {
    return NextResponse.json({ message: "Invalid Form Id." }, { status: 400 });
  }

  try {
    const updateReferralForm = await req.json();

    await prisma.referralForm.update({
      where: { id: referralFormId },
      data: updateReferralForm,
    });

    return NextResponse.json(
      { message: "Referral form updated successfully." },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  const referralFormId = req.nextUrl.pathname.split("/").pop();

  try {
    if (!referralFormId || !isValidCuid(referralFormId)) {
      return NextResponse.json(
        { message: "Invalid Form Id." },
        { status: 400 }
      );
    }

    const referralForm = await prisma.referralForm.findUnique({
      where: { id: referralFormId },
    });

    if (!referralForm) {
      return NextResponse.json(
        { message: "Referral form with this Id does not exists." },
        { status: 404 }
      );
    }

    await prisma.referralForm.delete({
      where: { id: referralFormId },
    });

    return NextResponse.json(
      { message: "Referral deleted successfully." },
      { status: 200 }
    );
  } catch (err) {
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
