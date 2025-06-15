import prisma from "@/lib/db";
import { createResponse } from "@/utils/createResponse";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  try {
    const services = await prisma.service.findMany({
      include: { subservices: true },
    });

    if (services.length === 0) {
      return NextResponse.json(
        createResponse(false, "No service exist yet", null),
        { status: 404 }
      );
    }

    return NextResponse.json(
      createResponse(true, "Services fetched fetched successfully.", services),
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    const errorMessage = error instanceof Error ? error.message : String(error);
    return NextResponse.json(createResponse(false, errorMessage, null), {
      status: 500,
    });
  }
}

export async function POST(req: NextRequest) {
  try {
    const service = await req.json();

    const servicesArray = Array.isArray(service) ? service : [service];

    await prisma.subService.createMany({
      data: servicesArray,
    });

    return NextResponse.json(
      { message: "services created successfully." },
      { status: 201 }
    );
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
