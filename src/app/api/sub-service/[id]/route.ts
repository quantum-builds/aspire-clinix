import { NextRequest, NextResponse } from "next/server";
import { isCuid } from "cuid";
import prisma from "@/lib/db";
import { createResponse } from "@/utils/createResponse";

export async function GET(req: NextRequest) {
  const id = req.nextUrl.pathname.split("/").pop();

  try {
    if (!id || !isCuid(id)) {
      return NextResponse.json(
        createResponse(false, "Invalid Sub Service Id.", null),
        { status: 400 }
      );
    }

    const subService = await prisma.subService.findMany({
      where: { id: id },
    });

    if (!subService) {
      return NextResponse.json(
        createResponse(
          false,
          "Sub service with this Id does not exists.",
          null
        ),
        { status: 404 }
      );
    }

    return NextResponse.json(
      createResponse(true, "Sub Services fetched successfully.", subService),
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
        { message: "Invalid Sub service Id." },
        { status: 400 }
      );
    }

    const updatedSubService = await req.json();

    const subService = await prisma.subService.update({
      where: { id: id },
      data: updatedSubService,
    });

    return NextResponse.json(
      {
        message: "sub service updated successfully.",
        data: subService,
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
    // Validate ID
    if (!id || !isCuid(id)) {
      return NextResponse.json(
        { error: "Invalid sub service ID" },
        { status: 400 }
      );
    }

    const currentSubService = await prisma.subService.findUnique({
      where: { id },
    });

    if (!currentSubService) {
      return NextResponse.json({ error: "service not found" }, { status: 404 });
    }

    // Parse incoming partial update
    const partialUpdate = await req.json();

    // Perform the update
    const updatedSubService = await prisma.subService.update({
      where: { id },
      data: partialUpdate,
    });

    return NextResponse.json(
      {
        message: "Sub Service updated successfully",
        data: updatedSubService,
      },
      { status: 200 }
    );
  } catch (err) {
    console.error("Error updating sub service :", err);
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
        createResponse(false, "Invalid Sub Service Id.", null),
        { status: 400 }
      );
    }

    const subService = await prisma.subService.findMany({
      where: { id: id },
    });

    if (!subService) {
      return NextResponse.json(
        createResponse(
          false,
          "Sub service with this Id does not exists.",
          null
        ),
        { status: 404 }
      );
    }

    await prisma.subService.delete({
      where: { id: id },
    });

    return NextResponse.json(
      { message: "Subservice is deleted successfully." },
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
