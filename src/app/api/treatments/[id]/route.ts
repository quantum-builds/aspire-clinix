import { ApiMethods } from "@/constants/ApiMethods";
import prisma from "@/lib/db";
import { isValidCuid } from "@/utils/typeValidUtils";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const treatmentId = req.nextUrl.pathname.split("/").pop();

  if (!treatmentId || !isValidCuid(treatmentId)) {
    return NextResponse.json(
      { message: "Invalid treament Id." },
      { status: 400 }
    );
  }

  try {
    const treatment = await prisma.treatment.findUnique({
      where: { id: treatmentId },
    });

    if (!treatment) {
      return NextResponse.json(
        { message: "This treatment does not exist." },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        message: "Treatment fetched successfully.",
        data: treatment,
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest) {
  const treatmentId = req.nextUrl.pathname.split("/").pop();

  if (!treatmentId || !isValidCuid(treatmentId)) {
    return NextResponse.json(
      { message: "Invalid treament Id." },
      { status: 400 }
    );
  }

  try {
    const updatedTreatment = await req.json();

    await prisma.treatment.update({
      where: { id: treatmentId },
      data: updatedTreatment,
    });

    return NextResponse.json(
      { message: "Treatment updated successfully." },
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
  const treatmentId = req.nextUrl.pathname.split("/").pop();

  if (!treatmentId || !isValidCuid(treatmentId)) {
    return NextResponse.json(
      { message: "Invalid Treatment Id." },
      { status: 400 }
    );
  }

  try {
    const discount = await prisma.treatment.findUnique({
      where: { id: treatmentId },
    });

    if (!discount) {
      return NextResponse.json(
        { message: "Treatmet with this Id does not exist." },
        { status: 404 }
      );
    }

    await prisma.treatment.delete({
      where: { id: treatmentId },
    });

    return NextResponse.json(
      { message: "Treatment deleted successfully." },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
