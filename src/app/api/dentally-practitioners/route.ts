import { getPractitioners } from "@/dentallyHelpers/practitioners";
import { TokenRoles } from "@/constants/UserRoles";
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

    if (token.role !== TokenRoles.ADMIN) {
      return NextResponse.json(createResponse(false, "Forbidden", null), {
        status: 403,
      });
    }

    const practitionersResponse = await getPractitioners();

    if (practitionersResponse.isError) {
      return NextResponse.json(
        createResponse(false, "Failed to fetch practitioners from Dentally.", null),
        { status: 500 },
      );
    }

    const practitioners = (practitionersResponse.response.practitioners || []).map(
      (p: any) => ({
        id: p.id,
        firstName: p.user?.firstName || "",
        lastName: p.user?.lastName || "",
        email: p.user?.email || "",
        gdcNumber: p.gdcNumber || "",
      }),
    );

    return NextResponse.json(
      createResponse(true, "Practitioners fetched successfully.", practitioners),
      { status: 200 },
    );
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    return NextResponse.json(createResponse(false, errorMessage, null), {
      status: 500,
    });
  }
}
