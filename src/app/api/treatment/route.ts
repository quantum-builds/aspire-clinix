import { ApiMethods } from "@/constants/ApiMethods";
import prisma from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  if (req.method !== ApiMethods.POST) {
    return NextResponse.json(
      { message: "Methond not allowed." },
      { status: 405 }
    );
  }

  const treatment = await req.json();

  try {
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
