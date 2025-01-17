import { ApiMethods } from "@/constants/ApiMethods";
import prisma from "@/lib/db";
import { isValidCuid } from "@/utils/typeValidUtils";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  if (req.method !== ApiMethods.GET) {
    return NextResponse.json(
      { message: "Methond not allowed." },
      { status: 405 }
    );
  }

  const treatmentId = req.nextUrl.searchParams.get("id");
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
  if (req.method !== ApiMethods.PUT) {
    return NextResponse.json(
      { message: "Methond not allowed." },
      { status: 405 }
    );
  }

  const treatmentId = req.nextUrl.searchParams.get("id");

  if (!treatmentId || !isValidCuid(treatmentId)) {
    return NextResponse.json(
      { message: "Invalid treatmen Id." },
      { status: 400 }
    );
  }

  const updatedTreatment = await req.json();

  try {
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
