import prisma from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  try {
    const treatments = await prisma.treatment.findMany({});

    if (treatments.length === 0) {
      return NextResponse.json(
        { message: "No treatment exist yet" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        message: "Treatments fetched successfully.",
        data: treatments,
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

export async function POST(req: NextRequest) {
  try {
    const treatment = await req.json();

    await prisma.treatment.create({
      data: treatment,
    });

    return NextResponse.json(
      { message: "Treatment created successfully. " },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
