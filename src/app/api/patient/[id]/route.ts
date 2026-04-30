import { TokenRoles } from "@/constants/UserRoles";
import {
  deletePatientById,
  getPatientById,
  patchPatientById,
} from "@/dentallyHelpers/patient";
import prisma from "@/lib/db";
import { createResponse } from "@/utils/createResponse";
import { isValidCuid } from "@/utils/typeValidUtils";
import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";

/**
 * @swagger
 * /api/patient/{id}:
 *   get:
 *     summary: Get a patient by ID
 *     tags: [Patient]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Patient ID (CUID)
 *     responses:
 *       200:
 *         description: Patient fetched successfully
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               message: "Patienst fetched successfully"
 *               data:
 *                 id: "pat_01HXYZ1234ABCDE"
 *                 uuid: "f7b8c9d0-1234-5678-90ab-cdef12345678"
 *                 dentallyId: "dent_01HXYZ1234ABCDE"
 *                 email: "john.doe@example.com"
 *                 mobileNumber: "+447700900123"
 *                 firstName: "John"
 *                 lastName: "Doe"
 *                 dateOfBirth: "1990-01-01"
 *                 familyId: "fam_01HXYZ1234ABCDE"
 *       400:
 *         description: Invalid Patient Id
 *         content:
 *           application/json:
 *             example:
 *               status: false
 *               message: "Invalid Patient Id"
 *               data: null
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             example:
 *               status: false
 *               message: "Unauthorized"
 *               data: null
 *       403:
 *         description: Forbidden
 *         content:
 *           application/json:
 *             example:
 *               status: false
 *               message: "Forbidden"
 *               data: null
 *       404:
 *         description: No patient found
 *         content:
 *           application/json:
 *             example:
 *               status: false
 *               message: "No Patient found"
 *               data: null
 *       500:
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             example:
 *               status: false
 *               message: "Internal Server Error"
 *               data: null
 *   patch:
 *     summary: Update a patient by ID
 *     tags: [Patient]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Patient ID (CUID)
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               firstName:
 *                 type: string
 *               lastName:
 *                 type: string
 *               mobilePhone:
 *                 type: string
 *               email:
 *                 type: string
 *               addressLine1:
 *                 type: string
 *               postCode:
 *                 type: string
 *               dateOfBirth:
 *                 type: string
 *                 format: date
 *             example:
 *               title: Mr
 *               firstName: John
 *               lastName: Doe
 *               mobilePhone: '+447700900123'
 *               email: john.doe@example.com
 *               addressLine1: 10 High Street
 *               postCode: SW1A 1AA
 *               dateOfBirth: '1990-01-01'
 *     responses:
 *       200:
 *         description: Patient updated successfully
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               message: "Patient is updated successfully"
 *               data:
 *                 id: "pat_01HXYZ1234ABCDE"
 *                 firstName: "John"
 *                 lastName: "Doe"
 *                 mobileNumber: "+447700900123"
 *                 email: "john.doe@example.com"
 *       400:
 *         description: Invalid Patient Id
 *         content:
 *           application/json:
 *             example:
 *               status: false
 *               message: "Invalid Patient Id"
 *               data: null
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             example:
 *               status: false
 *               message: "Unauthorized"
 *               data: null
 *       403:
 *         description: Forbidden
 *         content:
 *           application/json:
 *             example:
 *               status: false
 *               message: "Forbidden"
 *               data: null
 *       404:
 *         description: No patient found
 *         content:
 *           application/json:
 *             example:
 *               status: false
 *               message: "No Patient found"
 *               data: null
 *       500:
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             example:
 *               status: false
 *               message: "Internal Server Error"
 *               data: null
 *   delete:
 *     summary: Delete a patient by ID
 *     tags: [Patient]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Patient ID (CUID)
 *     responses:
 *       204:
 *         description: Patient deleted successfully
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               message: "Patient deleted successfully"
 *               data: null
 *       400:
 *         description: Invalid Patient Id
 *         content:
 *           application/json:
 *             example:
 *               status: false
 *               message: "Invalid Patient Id"
 *               data: null
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             example:
 *               status: false
 *               message: "Unauthorized"
 *               data: null
 *       403:
 *         description: Forbidden
 *         content:
 *           application/json:
 *             example:
 *               status: false
 *               message: "Forbidden"
 *               data: null
 *       404:
 *         description: No patient found
 *         content:
 *           application/json:
 *             example:
 *               status: false
 *               message: "No Patient found"
 *               data: null
 *       500:
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             example:
 *               status: false
 *               message: "Internal Server Error"
 *               data: null
 */
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
      return NextResponse.json(
        createResponse(false, "Invalid Patient Id", null),
        {
          status: 400,
        },
      );
    }

    if (token.role === TokenRoles.PATIENT) {
      return NextResponse.json(createResponse(false, "Forbidden", null), {
        status: 403,
      });
    }

    const existingPatient = await prisma.patient.findUnique({ where: { id: patientId, dentallyId: token.sub } })
    if (!existingPatient) {
      return NextResponse.json(
        createResponse(false, "No Patient found", null),
        { status: 404 },
      );
    }

    const getPatientRespose = await getPatientById(existingPatient.dentallyId);
    if (getPatientRespose.isError) {
      return getPatientRespose.response;
    }
    const patient = getPatientRespose.response;

    if (!patient) {
      return NextResponse.json(
        createResponse(false, "No Patient found", null),
        { status: 404 },
      );
    }

    return NextResponse.json(
      createResponse(true, "Patienst fetched successfully", patient),
      { status: 200 },
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
      return NextResponse.json(
        createResponse(false, "Invalid Patient Id", null),
        {
          status: 400,
        },
      );
    }

    let existingPatient = null
    if (token.role == TokenRoles.PATIENT) {
      existingPatient = await prisma.patient.findUnique({ where: { id: patientId, dentallyId: token.sub } })
    } else {
      existingPatient = await prisma.patient.findUnique({ where: { id: patientId } })
    }
    if (!existingPatient) {
      return NextResponse.json(
        createResponse(false, "No Patient found", null),
        { status: 404 },
      );
    }

    const respose = await getPatientById(existingPatient.dentallyId);
    if (respose.isError) {
      return respose.response;
    }
    const patient = respose.response;

    if (!patient) {
      return NextResponse.json(
        createResponse(false, "No Patient found", null),
        { status: 404 },
      );
    }

    const partialPatient = await req.json();

    const patchPatientRespose = await patchPatientById(
      existingPatient.dentallyId,
      partialPatient,
    );
    if (patchPatientRespose.isError) {
      return patchPatientRespose.response;
    }
    const updatedPatient = patchPatientRespose.response;

    return NextResponse.json(
      createResponse(true, "Patient is updated successfully", updatedPatient),
      { status: 200 },
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
      return NextResponse.json(
        createResponse(false, "Invalid Patient Id", null),
        {
          status: 400,
        },
      );
    }

    let existingPatient = null
    if (token.role == TokenRoles.PATIENT) {
      existingPatient = await prisma.patient.findUnique({ where: { id: patientId, dentallyId: token.sub } })
    } else {
      existingPatient = await prisma.patient.findUnique({ where: { id: patientId } })
    }
    if (!existingPatient) {
      return NextResponse.json(
        createResponse(false, "No Patient found", null),
        { status: 404 },
      );
    }

    const getPatientRespose = await getPatientById(existingPatient.dentallyId);

    if (getPatientRespose.isError) {
      return getPatientRespose.response;
    }
    const patient = getPatientRespose.response;

    if (!patient) {
      return NextResponse.json(
        createResponse(false, "No Patient found", null),
        { status: 404 },
      );
    }

    const deletePatientRespose = await deletePatientById(existingPatient.dentallyId);
    if (deletePatientRespose.isError) {
      return deletePatientRespose.response;
    }

    return NextResponse.json(
      createResponse(true, "Patient is deleted successfully", null),
      { status: 204 },
    );
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    return NextResponse.json(createResponse(false, errorMessage, null), {
      status: 500,
    });
  }
}
