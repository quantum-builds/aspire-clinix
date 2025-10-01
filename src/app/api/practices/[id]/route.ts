import { TokenRoles } from "@/constants/UserRoles";
import prisma from "@/lib/db";
import { createResponse } from "@/utils/createResponse";
import { isValidCuid } from "@/utils/typeValidUtils";
import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const token = await getToken({ req });

    if (!token || token.role !== TokenRoles.ADMIN) {
      return NextResponse.json(
        createResponse(false, "Forbidden to perform this action", null),
        {
          status: 403,
        }
      );
    }

    const practiceId = req.nextUrl.pathname.split("/").pop();
    if (!practiceId || !isValidCuid(practiceId)) {
      return NextResponse.json(
        { message: "Invalid Practice Id." },
        { status: 400 }
      );
    }

    const practice = await prisma.practice.findUnique({
      where: { id: practiceId },
      include: {
        dentists: {
          where: { status: "APPROVED" },
          include: {
            dentist: true, // this pulls the actual Dentist record
          },
        },
      },
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
