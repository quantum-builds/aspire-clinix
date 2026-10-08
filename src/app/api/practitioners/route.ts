import { getPractitioners } from "@/dentallyHelpers/practitioners";
import { TPractitioner } from "@/types/common";
import { createResponse } from "@/utils/createResponse";
import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";

type DentallyPractitioner = {
  id: number;
  active?: boolean;
  gdcNumber?: string | null;
  user?: {
    firstName?: string | null;
    lastName?: string | null;
    role?: string | null;
    imageUrl?: string | null;
  } | null;
};

export async function GET(req: NextRequest) {
  try {
    const token = await getToken({ req });

    if (!token) {
      return NextResponse.json(createResponse(false, "Unauthorized", null), {
        status: 401,
      });
    }

    const practitionersResponse = await getPractitioners();

    if (practitionersResponse.isError) {
      return practitionersResponse.response;
    }

    const practitioners: TPractitioner[] = (
      (practitionersResponse.response.practitioners ||
        []) as DentallyPractitioner[]
    )
      .filter((practitioner) => practitioner.active === true)
      .map((practitioner) => ({
        id: practitioner.id,
        firstName: practitioner.user?.firstName || "",
        lastName: practitioner.user?.lastName || "",
        gdcNumber: practitioner.gdcNumber?.trim() || undefined,
        role: practitioner.user?.role || undefined,
        imageUrl: practitioner.user?.imageUrl || null,
      }));

    return NextResponse.json(
      createResponse(
        true,
        "Practitioners fetched successfully.",
        practitioners,
      ),
      { status: 200 },
    );
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    return NextResponse.json(createResponse(false, errorMessage, null), {
      status: 500,
    });
  }
}
