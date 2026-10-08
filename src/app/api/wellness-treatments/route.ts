import { getWellnessTreatments } from "@/dentallyHelpers/treatment";
import { TTreatment } from "@/types/common";
import { createResponse } from "@/utils/createResponse";
import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const token = await getToken({ req });

    if (!token) {
      return NextResponse.json(createResponse(false, "Unauthorized", null), {
        status: 401,
      });
    }

    const treatmentsResponse = await getWellnessTreatments();

    if (treatmentsResponse.isError) {
      return treatmentsResponse.response;
    }

    const treatments: TTreatment[] = treatmentsResponse.response.treatments || [];
  
    return NextResponse.json(
      createResponse(true, "Wellness treatments fetched successfully.", treatments),
      { status: 200 },
    );
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    return NextResponse.json(createResponse(false, errorMessage, null), {
      status: 500,
    });
  }
}
