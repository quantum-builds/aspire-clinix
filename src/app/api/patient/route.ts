import { createResponse } from "@/utils/createResponse";
import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import { TokenRoles } from "@/constants/UserRoles";
import {
  getPatient,
  getPatientById,
  getPatients,
} from "@/dentallyHelpers/patient";

/**
 * @swagger
 * /api/patient:
 *   get:
 *     summary: Get patient data
 *     tags: [Patient]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: query
 *         name: email
 *         schema:
 *           type: string
 *         description: Admin-only filter to fetch a patient by email
 *     responses:
 *       200:
 *         description: Patient or patients fetched successfully
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               message: "Patient record successfully fetched"
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
  try {
    const token = await getToken({ req });

    if (!token) {
      return NextResponse.json(createResponse(false, "Unauthorized", null), {
        status: 401,
      });
    }

    if (token.role === TokenRoles.PATIENT) {
      const patientDentallyId = token.sub ?? "";

      const respose = await getPatientById(patientDentallyId);
      if (respose.isError) {
        return respose.response;
      }
      const patient = respose.response;

      if (!patient) {
        return NextResponse.json(
          createResponse(false, "No Patient found", patient),
          { status: 404 },
        );
      }

      return NextResponse.json(
        createResponse(true, "Patient record successfully fetched", patient),
        { status: 200 },
      );
    } else if (token.role === TokenRoles.ADMIN) {
      const { searchParams } = new URL(req.url);
      const emailParam = searchParams.get("email") || "";

      // decode URL-encoded email
      const email = decodeURIComponent(emailParam);
      console.log("email is ", email);
      if (email.trim().length > 0) {
        const respose = await getPatient({ emailAddress: email });
        if (respose.isError) {
          return respose.response;
        }
        const patient = respose.response;

        if (!patient) {
          return NextResponse.json(
            createResponse(false, "No Patient found", patient),
            { status: 404 },
          );
        }

        return NextResponse.json(
          createResponse(true, "Patiensts fetched successfully", patient),
          { status: 200 },
        );
      } else {
        const respose = await getPatients();
        if (respose.isError) {
          return respose.response;
        }
        const patients = respose.response;

        if (patients.length < 1) {
          return NextResponse.json(
            createResponse(false, "No Patient found", null),
            { status: 404 },
          );
        }

        return NextResponse.json(
          createResponse(true, "Patiensts fetched successfully", patients),
          { status: 200 },
        );
      }
    } else {
      return NextResponse.json(createResponse(false, "Forbidden", null), {
        status: 403,
      });
    }
  } catch (error) {
    console.log("Error in fetching patients ", error);
    const errorMessage = error instanceof Error ? error.message : String(error);
    return NextResponse.json(createResponse(false, errorMessage, null), {
      status: 500,
    });
  }
}