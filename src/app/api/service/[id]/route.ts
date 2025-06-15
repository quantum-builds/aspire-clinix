import { NextRequest, NextResponse } from "next/server";
import { isCuid } from "cuid";
import prisma from "@/lib/db";
import { createResponse } from "@/utils/createResponse";

export async function GET(req: NextRequest) {
  const id = req.nextUrl.pathname.split("/").pop();

  try {
    if (!id || !isCuid(id)) {
      return NextResponse.json(
        createResponse(false, "Invalid service Id.", null),
        { status: 400 }
      );
    }

    const service = await prisma.service.findMany({
      where: { id: id },
    });

    if (!service) {
      return NextResponse.json(
        createResponse(false, "Service with this Id does not exists.", null),
        { status: 404 }
      );
    }

    return NextResponse.json(
      createResponse(true, "Services fetched successfully.", service),
      { status: 200 }
    );
  } catch (error) {
    console.log(error);
    const errorMessage = error instanceof Error ? error.message : String(error);
    return NextResponse.json(createResponse(true, errorMessage, null), {
      status: 500,
    });
  }
}

export async function PUT(req: NextRequest) {
  const id = req.nextUrl.pathname.split("/").pop();
  try {
    if (!id || !isCuid(id)) {
      return NextResponse.json(
        { message: "Invalid Service Id." },
        { status: 400 }
      );
    }

    const updatedService = await req.json();

    const service = await prisma.service.update({
      where: { id: id },
      data: updatedService,
    });

    return NextResponse.json(
      {
        message: "Service updated successfully.",
        data: service,
      },
      { status: 200 }
    );
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function PATCH(req: NextRequest) {
  const id = req.nextUrl.pathname.split("/").pop();

  try {
    if (!id || !isCuid(id)) {
      return NextResponse.json(
        { error: "Invalid service ID" },
        { status: 400 }
      );
    }

    const currentService = await prisma.service.findUnique({
      where: { id },
    });

    if (!currentService) {
      return NextResponse.json({ error: "Service not found" }, { status: 404 });
    }

    // Parse incoming partial update
    const partialUpdate = await req.json();

    // Perform the update
    const updatedService = await prisma.service.update({
      where: { id },
      data: partialUpdate,
    });

    return NextResponse.json(
      {
        message: "Service updated successfully",
        data: updatedService,
      },
      { status: 200 }
    );
  } catch (err) {
    console.error("Error updating service :", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  const id = req.nextUrl.pathname.split("/").pop();

  try {
    if (!id || !isCuid(id)) {
      return NextResponse.json(
        createResponse(false, "Invalid Service Id.", null),
        { status: 400 }
      );
    }

    const service = await prisma.service.findMany({
      where: { id: id },
    });

    if (!service) {
      return NextResponse.json(
        createResponse(false, "service with this Id does not exists.", null),
        { status: 404 }
      );
    }

    await prisma.service.delete({
      where: { id: id },
    });

    return NextResponse.json(
      { message: "service is deleted successfully." },
      { status: 200 }
    );
  } catch (error) {
    console.log(error);
    const errorMessage = error instanceof Error ? error.message : String(error);
    return NextResponse.json(createResponse(true, errorMessage, null), {
      status: 500,
    });
  }
}
