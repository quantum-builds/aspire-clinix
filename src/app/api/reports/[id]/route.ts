import prisma from "@/lib/db";
import { createResponse } from "@/utils/createResponse";
import { isValidCuid } from "@/utils/typeValidUtils";
import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";

export async function PATCH(req: NextRequest) {
  try {
    // const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

    // if (!token || token.role !== "dentist") {
    //   return NextResponse.json(createResponse(false, "Unauthorized", null), {
    //     status: 401,
    //   });
    // }

    const reportId = req.nextUrl.pathname.split("/").pop();

    if (!reportId || !isValidCuid(reportId)) {
      return NextResponse.json(
        createResponse(false, "Invalid Report Id.", null),
        { status: 400 }
      );
    }

    const updatedReport = await req.json();

    await prisma.report.update({
      where: { id: reportId },
      data: updatedReport,
    });

    return NextResponse.json(
      createResponse(true, "Resport updated successfully.", null),
      { status: 200 }
    );
  } catch (error) {
    console.log("Error in updating report ", error);
    const errorMessage = error instanceof Error ? error.message : String(error);
    return NextResponse.json(createResponse(false, errorMessage, null), {
      status: 500,
    });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

    if (!token || token.role !== "dentist") {
      return NextResponse.json(createResponse(false, "Unauthorized", null), {
        status: 401,
      });
    }

    const reportId = req.nextUrl.pathname.split("/").pop();

    if (!reportId || !isValidCuid(reportId)) {
      return NextResponse.json(
        createResponse(false, "Invalid Report Id.", null),
        { status: 400 }
      );
    }

    const report = await prisma.report.findUnique({
      where: { id: reportId },
    });

    if (!report) {
      return NextResponse.json(
        createResponse(false, "Report with this Id does not exist.", null),
        { status: 404 }
      );
    }

    await prisma.report.delete({
      where: { id: reportId },
    });

    return NextResponse.json(
      createResponse(true, "Report deleted successfully.", null),
      { status: 200 }
    );
  } catch (error) {
    console.log("Error in deleting report ", error);
    const errorMessage = error instanceof Error ? error.message : String(error);
    return NextResponse.json(createResponse(false, errorMessage, null), {
      status: 500,
    });
  }
}
