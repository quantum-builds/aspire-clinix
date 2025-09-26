import prisma from "@/lib/db";
import { createResponse } from "@/utils/createResponse";
import { Prisma } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { practiceId, dentistId } = await req.json();

    if (!practiceId || !dentistId) {
      return NextResponse.json(
        createResponse(false, "practiceId and dentistId are required", null),
        { status: 400 }
      );
    }

    const exitingRelation = await prisma.dentistOnPractice.findUnique({
      where: {
        practiceId_dentistId: {
          practiceId,
          dentistId,
        },
      },
    });

    if (exitingRelation) {
      return NextResponse.json(
        createResponse(
          false,
          "Dentist is already a part of the practice",
          null
        ),
        { status: 404 }
      );
    }

    const practice = await prisma.practice.findUnique({
      where: { id: practiceId },
    });

    if (!practice) {
      return NextResponse.json(
        createResponse(false, "Practice does not exist", null),
        { status: 404 }
      );
    }

    const dentist = await prisma.dentist.findUnique({
      where: { id: dentistId },
    });

    if (!dentist) {
      return NextResponse.json(
        createResponse(false, "Dentist does not exist", null),
        { status: 404 }
      );
    }

    await prisma.dentistOnPractice.create({
      data: {
        dentistId: dentistId,
        practiceId: practiceId,
      },
    });

    return NextResponse.json(
      createResponse(true, "Data created successfully", null),
      { status: 200 }
    );
  } catch (error) {
    console.log("Error in creating dentist-practice ", error);
    const errorMessage = error instanceof Error ? error.message : String(error);
    return NextResponse.json(createResponse(false, errorMessage, null), {
      status: 500,
    });
  }
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);

    const practiceId = searchParams.get("practiceId") || "";
    const dentistId = searchParams.get("dentistId") || "";

    let baseWhere: Prisma.DentistOnPracticeWhereInput = {
      ...(practiceId && { practiceId }),
      ...(dentistId && { dentistId }),
    };

    const data = await prisma.dentistOnPractice.findMany({
      where: baseWhere,
      include: { dentist: true, practice: true },
    });

    if (!data || data.length < 1) {
      return NextResponse.json(createResponse(false, "No Data Found", null), {
        status: 404,
      });
    }

    return NextResponse.json(
      createResponse(true, "Data fetched successfully", data),
      { status: 200 }
    );
  } catch (error) {
    console.log("Error in fetching dentist-practice ", error);
    const errorMessage = error instanceof Error ? error.message : String(error);
    return NextResponse.json(createResponse(false, errorMessage, null), {
      status: 500,
    });
  }
}
