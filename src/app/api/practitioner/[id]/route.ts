import { TokenRoles } from "@/constants/UserRoles";
import { patchPatientById } from "@/dentallyHelpers/patient";
import { gettPractitionerById } from "@/dentallyHelpers/practitioners";
import { createResponse } from "@/utils/createResponse";
import { isValidCuid } from "@/utils/typeValidUtils";
import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const token = await getToken({ req });

  if (!token) {
    return NextResponse.json(createResponse(false, "Unauthorized", null), {
      status: 401,
    });
  }

  if (token.role !== TokenRoles.PRACTITIONER && token.role !== TokenRoles.ADMIN) {
    return NextResponse.json(createResponse(false, "Forbidden", null), {
      status: 403,
    });
  }

  try {
    const practitionerId = req.nextUrl.pathname.split("/").pop();

    if (!practitionerId || !isValidCuid(practitionerId)) {
      return NextResponse.json(
        createResponse(false, "Invalid Practitioner Id.", null),
        { status: 400 }
      );
    }

    const respose = await gettPractitionerById(practitionerId)
    if (respose.isError) {
      return respose.response
    }
    const practitioner = respose.response

    if (!practitioner) {
      return NextResponse.json(
        createResponse(false, "No Practitioner found", null),
        { status: 404 }
      );
    }

    return NextResponse.json(
      createResponse(true, "Practitioner fetched successfully", practitioner),
      { status: 200 }
    );
  } catch (error) {
    console.log("Error in fetching practitioner", error);
    const errorMessage = error instanceof Error ? error.message : String(error);
    return NextResponse.json(createResponse(false, errorMessage, null), {
      status: 500,
    });
  }
}

export async function PATCH(req: NextRequest) {
  const token = await getToken({ req });

  if (!token) {
    return NextResponse.json(createResponse(false, "Unauthorized", null), {
      status: 401,
    });
  }

  if (token.role !== TokenRoles.PRACTITIONER && token.role !== TokenRoles.ADMIN) {
    return NextResponse.json(createResponse(false, "Forbidden", null), {
      status: 403,
    });
  }

  try {
    const practitionerId = req.nextUrl.pathname.split("/").pop();

    if (!practitionerId || !isValidCuid(practitionerId)) {
      return NextResponse.json(
        { message: "Invalid Practitioner Id." },
        { status: 400 }
      );
    }

    const respose = await gettPractitionerById(practitionerId)
    if (respose.isError) {
      return respose.response
    }
    const practitioner = respose.response

    if (!practitioner) {
      return NextResponse.json(
        createResponse(false, "No Practitioner found", null),
        { status: 404 }
      );
    }

    const partialPatient = await req.json();

    const patchPatientRespose = await patchPatientById(practitionerId, partialPatient)
    if (patchPatientRespose.isError) {
      return patchPatientRespose.response
    }
    const updatedPatient = patchPatientRespose.response

    return NextResponse.json(
      createResponse(true, "Practitioner is updated successfully", updatedPatient),
      { status: 200 }
    );
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    return NextResponse.json(createResponse(false, errorMessage, null), {
      status: 500,
    });
  }
}
