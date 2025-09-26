import prisma from "@/lib/db";
import { createResponse } from "@/utils/createResponse";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const practice = await req.json();
    const newPractce = await prisma.practice.create({
      data: { ...practice },
    });

    return NextResponse.json(
      createResponse(true, "Practices created successfully", newPractce),
      { status: 201 }
    );
  } catch (error) {
    console.log("Error in creating appointment ", error);
    const errorMessage = error instanceof Error ? error.message : String(error);
    return NextResponse.json(createResponse(false, errorMessage, null), {
      status: 500,
    });
  }
}

export async function GET() {
  try {
    const practices = await prisma.practice.findMany({});

    if (!practices || practices.length < 1) {
      return NextResponse.json(
        createResponse(false, "No practice found", null),
        {
          status: 404,
        }
      );
    }
    return NextResponse.json(
      createResponse(true, "Practices fetched successfully", practices),
      {
        status: 200,
      }
    );
  } catch (error) {
    console.log("Error in fetching practices ", error);
    const errorMessage = error instanceof Error ? error.message : String(error);
    return NextResponse.json(createResponse(false, errorMessage, null), {
      status: 500,
    });
  }
}
