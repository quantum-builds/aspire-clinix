import { createResponse } from "@/utils/createResponse";
import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import { TokenRoles } from "@/constants/UserRoles";
import {
  getPatient,
  getPatientById,
  getPatients,
  patchPatientById,
} from "@/dentallyHelpers/patient";
import prisma from "@/lib/db";
import { title } from "process";

export const dynamic = "force-dynamic";

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
    console.log("Token: ", token);

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
      const patient = respose.response.patient;

      if (!patient) {
        return NextResponse.json(
          createResponse(false, "No Patient found", null),
          { status: 404 },
        );
      }

      const dbPatient = await prisma.patient.findUnique({
        where: { dentallyId: Number(patientDentallyId) },
        select: { imageUrl: true, familyId: true },
      });
      if (dbPatient?.imageUrl) {
        patient.imageUrl = dbPatient.imageUrl;
      }
      if (dbPatient?.familyId) {
        patient.familyId = dbPatient.familyId;
      }

      return NextResponse.json(
        createResponse(true, "Patient record successfully fetched", patient),
        { status: 200 },
      );
    } else if (token.role === TokenRoles.ADMIN) {
      const { searchParams } = new URL(req.url);
      const emailParam = searchParams.get("email") || "";

      const email = decodeURIComponent(emailParam);
      console.log("email is ", email);
      if (email.trim().length > 0) {
        const respose = await getPatient({ emailAddress: email });
        if (respose.isError) {
          return respose.response;
        }
        const patients = respose.response.patients;

        if (!patients || patients.length < 1) {
          return NextResponse.json(
            createResponse(false, "No Patient found", null),
            { status: 404 },
          );
        }

        return NextResponse.json(
          createResponse(true, "Patiensts fetched successfully", patients),
          { status: 200 },
        );
      } else {
        const respose = await getPatients();
        if (respose.isError) {
          return respose.response;
        }
        const patients = respose.response.patients ?? [];

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

export async function PATCH(req: NextRequest) {
  try {
    const token = await getToken({ req });

    if (!token) {
      return NextResponse.json(createResponse(false, "Unauthorized", null), {
        status: 401,
      });
    }

    const payload = await req.json();

    if (token.role === TokenRoles.PATIENT) {
      const patientDentallyId = token.sub ?? "";

      if (!payload || Object.keys(payload).length === 0) {
        return NextResponse.json(
          createResponse(false, "No fields to update provided", null),
          { status: 400 },
        );
      }

      const respose = await patchPatientById(patientDentallyId, payload);
      if (respose.isError) {
        return respose.response;
      }

      const patientData = respose.response.patient;

      if (!patientData) {
        return NextResponse.json(
          createResponse(false, "No Patient found", null),
          { status: 404 },
        );
      }

      const name = [patientData.firstName, patientData.lastName].filter(Boolean).join(" ").trim();
      const email = patientData.emailAddress || patientData.email || "";
      const mobileNumber = patientData.mobilePhone || "";

      const prismaData: Record<string, any> = {};
      if (name) prismaData.name = name;
      if (email) prismaData.email = email;
      if (mobileNumber) prismaData.mobileNumber = mobileNumber;
      if (patientData.dateOfBirth) prismaData.dateOfBirth = patientData.dateOfBirth;
      if (payload.fileUrl) prismaData.imageUrl = payload.fileUrl;

      await prisma.patient.update({
        where: { dentallyId: Number(patientDentallyId) },
        data: prismaData,
      });

      const responseData = {
        ...patientData,
        fileUrl: payload.fileUrl || patientData.fileUrl || "",
      };

      return NextResponse.json(
        createResponse(true, "Patient updated successfully", responseData),
        { status: 200 },
      );
    }

    return NextResponse.json(createResponse(false, "Forbidden", null), {
      status: 403,
    });
  } catch (error) {
    console.log("Error in updating patient ", error);
    const errorMessage = error instanceof Error ? error.message : String(error);
    return NextResponse.json(createResponse(false, errorMessage, null), {
      status: 500,
    });
  }
}
