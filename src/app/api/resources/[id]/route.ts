import prisma from "@/lib/db";
import { createResponse } from "@/utils/createResponse";
import { isValidCuid } from "@/utils/typeValidUtils";
import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";

export async function PATCH(req: NextRequest) {
  try {
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

    if (!token || token.role !== "admin") {
      return NextResponse.json(createResponse(false, "Unauthorized", null), {
        status: 401,
      });
    }

    const resourceId = req.nextUrl.pathname.split("/").pop();

    if (!resourceId || !isValidCuid(resourceId)) {
      return NextResponse.json(
        createResponse(false, "Invalid Resource Id.", null),
        { status: 400 }
      );
    }

    const updatedResource = await req.json();

    await prisma.resource.update({
      where: { id: resourceId },
      data: updatedResource,
    });

    return NextResponse.json(
      createResponse(true, "Resource updated successfully.", null),
      { status: 200 }
    );
  } catch (error) {
    console.log("Error in updating resource ", error);
    const errorMessage = error instanceof Error ? error.message : String(error);
    return NextResponse.json(createResponse(false, errorMessage, null), {
      status: 500,
    });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

    if (!token || token.role !== "admin") {
      return NextResponse.json(createResponse(false, "Unauthorized", null), {
        status: 401,
      });
    }

    const resourceId = req.nextUrl.pathname.split("/").pop();

    if (!resourceId || !isValidCuid(resourceId)) {
      return NextResponse.json(
        createResponse(false, "Invalid Resource Id.", null),
        { status: 400 }
      );
    }

    const resource = await prisma.resource.findUnique({
      where: { id: resourceId },
    });

    if (!resource) {
      return NextResponse.json(
        createResponse(false, "Resource with this Id does not exist.", null),
        { status: 404 }
      );
    }

    await prisma.resource.delete({
      where: { id: resourceId },
    });

    return NextResponse.json(
      createResponse(true, "Resource deleted successfully.", null),
      { status: 200 }
    );
  } catch (error) {
    console.log("Error in deleting resource ", error);
    const errorMessage = error instanceof Error ? error.message : String(error);
    return NextResponse.json(createResponse(false, errorMessage, null), {
      status: 500,
    });
  }
}
