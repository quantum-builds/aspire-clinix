import { TokenRoles } from "@/constants/UserRoles";
import { deletePatientById, getPatientById, patchPatientById } from "@/dentallyHelpers/patient";
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

  if (token.role === TokenRoles.PATIENT || token.role === TokenRoles.ADMIN) {
    return NextResponse.json(createResponse(false, "Forbidden", null), {
      status: 403,
    });
  }

  try {
    const patientId = req.nextUrl.pathname.split("/").pop();

    if (!patientId || !isValidCuid(patientId)) {
      return NextResponse.json(createResponse(false, "Invalid Patient Id", null), {
        status: 400,
      });
    }

    if (token.role === TokenRoles.PATIENT && patientId !== token.sub) {
      return NextResponse.json(createResponse(false, "Forbidden", null), {
        status: 403,
      });
    }

    const getPatientRespose = await getPatientById(patientId)
    if (getPatientRespose.isError) {
      return getPatientRespose.response
    }
    const patient = getPatientRespose.response

    if (!patient) {
      return NextResponse.json(
        createResponse(false, "No Patient found", null),
        { status: 404 }
      );
    }

    return NextResponse.json(
      createResponse(true, "Patienst fetched successfully", patient),
      { status: 200 }
    );
  } catch (error) {
    console.log("Error in fetching patient", error);
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

  if (token.role === TokenRoles.PATIENT || token.role === TokenRoles.ADMIN) {
    return NextResponse.json(createResponse(false, "Forbidden", null), {
      status: 403,
    });
  }

  // get id from the token but for now will be getting in search params
  try {
    const patientId = req.nextUrl.pathname.split("/").pop();

    if (!patientId || !isValidCuid(patientId)) {
      return NextResponse.json(createResponse(false, "Invalid Patient Id", null), {
        status: 400,
      });
    }

    const respose = await getPatientById(patientId)
    if (respose.isError) {
      return respose.response
    }
    const patient = respose.response

    if (!patient) {
      return NextResponse.json(
        createResponse(false, "No Patient found", null),
        { status: 404 }
      );
    }

    const partialPatient = await req.json();

    const patchPatientRespose = await patchPatientById(patientId, partialPatient)
    if (patchPatientRespose.isError) {
      return patchPatientRespose.response
    }
    const updatedPatient = patchPatientRespose.response

    return NextResponse.json(
      createResponse(true, "Patient is updated successfully", updatedPatient),
      { status: 200 }
    );
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    return NextResponse.json(createResponse(false, errorMessage, null), {
      status: 500,
    });
  }
}

export async function DELETE(req: NextRequest) {
  const token = await getToken({ req });

  if (!token) {
    return NextResponse.json(createResponse(false, "Unauthorized", null), {
      status: 401,
    });
  }

  if (token.role === TokenRoles.PATIENT || token.role === TokenRoles.ADMIN) {
    return NextResponse.json(createResponse(false, "Forbidden", null), {
      status: 403,
    });
  }

  // get id from the token but for now will be getting in search params
  try {
    const patientId = req.nextUrl.pathname.split("/").pop();

    if (!patientId || !isValidCuid(patientId)) {
      return NextResponse.json(createResponse(false, "Invalid Patient Id", null), {
        status: 400,
      });
    }

    const getPatientRespose = await getPatientById(patientId)
    if (getPatientRespose.isError) {
      return getPatientRespose.response
    }
    const patient = getPatientRespose.response

    if (!patient) {
      return NextResponse.json(
        createResponse(false, "No Patient found", null),
        { status: 404 }
      );
    }

    const deletePatientRespose = await deletePatientById(patientId)
    if (deletePatientRespose.isError) {
      return deletePatientRespose.response
    }

    return NextResponse.json(
      createResponse(true, "Patient is deleted successfully", null),
      { status: 204 }
    );
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    return NextResponse.json(createResponse(false, errorMessage, null), {
      status: 500,
    });
  }
}
