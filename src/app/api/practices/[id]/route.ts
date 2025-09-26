import prisma from "@/lib/db";
import { createResponse } from "@/utils/createResponse";
import { isValidCuid } from "@/utils/typeValidUtils";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const practiceId = req.nextUrl.pathname.split("/").pop();
    if (!practiceId || !isValidCuid(practiceId)) {
      return NextResponse.json(
        { message: "Invalid Practice Id." },
        { status: 400 }
      );
    }

    const practice = await prisma.practice.findUnique({
      where: { id: practiceId },
      include: { dentists: true },
    });

    if (!practice) {
      return NextResponse.json(
        createResponse(false, "No practice found", null),
        {
          status: 404,
        }
      );
    }
    return NextResponse.json(
      createResponse(true, "Practice fetched successfully", practice),
      {
        status: 200,
      }
    );
  } catch (error) {
    console.log("Error in fetching practice", error);
    const errorMessage = error instanceof Error ? error.message : String(error);
    return NextResponse.json(createResponse(false, errorMessage, null), {
      status: 500,
    });
  }
}
