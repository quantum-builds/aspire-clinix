import { ApiMethods } from "@/constants/ApiMethods";
import prisma from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  if (req.method !== ApiMethods.GET) {
    return NextResponse.json(
      { message: "Methond not allowed." },
      { status: 405 }
    );
  }

  try {
    const treatments = await prisma.appointment.findMany({});

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
