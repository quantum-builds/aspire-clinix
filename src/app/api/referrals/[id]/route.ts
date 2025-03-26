import { NextResponse, NextRequest } from "next/server";
import prisma from "@/lib/db";
import { isValidCuid } from "@/utils/typeValidUtils";

export async function GET(req: NextRequest) {
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

    return NextResponse.json(
      {
        message: "Referral form fetched successfully.",
        data: referralForm,
      },
      { status: 200 }
    );
  } catch (err) {
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest) {
  const referralFormId = req.nextUrl.pathname.split("/").pop();

  if (!referralFormId || !isValidCuid(referralFormId)) {
    return NextResponse.json({ message: "Invalid Form Id." }, { status: 400 });
  }

  try {
    const updateReferralForm = await req.json();
    // const { dentistId, patientId } = updateReferralForm;

    // console.log(dentistId + " " + patientId);

    // if (!isValidCuid(dentistId) || !isValidCuid(patientId)) {
    //   return NextResponse.json(
    //     { message: "Invalid patient or dentist Id." },
    //     { status: 400 }
    //   );
    // }

    // const dentist = await prisma.dentist.findUnique({
    //   where: { id: dentistId },
    // });

    // if (!dentist) {
    //   return NextResponse.json(
    //     { message: "This doctor does not exists." },
    //     { status: 404 }
    //   );
    // }

    // const patient = await prisma.dentist.findUnique({
    //   where: { id: patientId },
    // });

    // if (!patient) {
    //   return NextResponse.json(
    //     { message: "This patient does not exists." },
    //     { status: 404 }
    //   );
    // }
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
