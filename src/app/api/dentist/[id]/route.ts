import prisma from "@/lib/db";
import { createResponse } from "@/utils/createResponse";
import { isValidCuid } from "@/utils/typeValidUtils";
import { NextRequest, NextResponse } from "next/server";

export async function PATCH(req: NextRequest) {
  try {
    // const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

    // if (!token || token.role !== "admin") {
    //   return NextResponse.json(createResponse(false, "Unauthorized", null), {
    //     status: 401,
    //   });
    // }

    const dentistId = req.nextUrl.pathname.split("/").pop();

    if (!dentistId || !isValidCuid(dentistId)) {
      return NextResponse.json(
        createResponse(false, "Invalid Dentist Id.", null),
        { status: 400 }
      );
    }

    const updatedDentist = await req.json();

    await prisma.dentist.update({
      where: { id: dentistId },
      data: updatedDentist,
    });

    return NextResponse.json(
      createResponse(true, "Dentist updated successfully.", null),
      { status: 200 }
    );
  } catch (error) {
    console.log("Error in updating dentist ", error);
    const errorMessage = error instanceof Error ? error.message : String(error);
    return NextResponse.json(createResponse(false, errorMessage, null), {
      status: 500,
    });
  }
}
