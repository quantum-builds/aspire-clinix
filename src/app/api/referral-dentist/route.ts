import prisma from "@/lib/db";
import bcrypt from "bcryptjs";
import { createResponse } from "@/utils/createResponse";
import { NextRequest, NextResponse } from "next/server";
import { DentistRole } from "@prisma/client";
import { getToken } from "next-auth/jwt";
import { TokenRoles } from "@/constants/UserRoles";
import { getPatient } from "@/dentallyHelpers/patient";

/**
 * @swagger
 * /api/referral-dentist:
 *   get:
 *     summary: Get referral dentist profile or all dentists for admin
 *     tags: [Referral Dentist]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Dentist record fetched successfully
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               message: "Dentist record successfully fetched"
 *               data:
 *                 dentist:
 *                   id: "dent_01HXYZ1234ABCDE"
 *                   email: "sarah.ahmed@clinic.com"
 *                   phoneNumber: "+447700900123"
 *                   gdcNo: "GDC123456"
 *                   firstName: "Sarah"
 *                   lastName: "Ahmed"
 *                 request:
 *                   dentistId: "dent_01HXYZ1234ABCDE"
 *                   practiceId: "prac_01HXYZ1234ABCDE"
 *                   status: "PENDING"
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
 *         description: No dentist found
 *         content:
 *           application/json:
 *             example:
 *               status: false
 *               message: "No Dentist found"
 *               data: null
 *       500:
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             example:
 *               status: false
 *               message: "Internal Server Error"
 *               data: null
 *   post:
 *     summary: Register a referral dentist
 *     tags: [Referral Dentist]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - phoneNumber
 *               - gdcNo
 *               - role
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *               phoneNumber:
 *                 type: string
 *               gdcNo:
 *                 type: string
 *               practiceId:
 *                 type: string
 *               password:
 *                 type: string
 *               role:
 *                 type: string
 *     responses:
 *       201:
 *         description: Dentist registered successfully
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               message: "Dentist registered successfully"
 *               data:
 *                 id: "dent_01HXYZ1234ABCDE"
 *                 email: "sarah.ahmed@clinic.com"
 *                 phoneNumber: "+447700900123"
 *                 gdcNo: "GDC123456"
 *                 role: "REFERRING_DENTIST"
 *       400:
 *         description: Validation failed or fields already in use
 *         content:
 *           application/json:
 *             example:
 *               status: false
 *               message: "These fields are already in use: email"
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
 *     summary: Update the authenticated referral dentist
 *     tags: [Referral Dentist]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               gdcNo:
 *                 type: string
 *               dentallyId:
 *                 type: string
 *               firstName:
 *                 type: string
 *               lastName:
 *                 type: string
 *               appointmentIds:
 *                 type: array
 *                 items:
 *                   type: string
 *             example:
 *               email: sarah.ahmed@clinic.com
 *               gdcNo: GDC123456
 *               dentallyId: DENTALLY-001
 *               firstName: Sarah
 *               lastName: Ahmed
 *               appointmentIds:
 *                 - appt_01HZYABC123
 *                 - appt_01HZYABC456
 *     responses:
 *       200:
 *         description: Dentist updated successfully
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               message: "Dentist updated successfully."
 *               data: null
 *       400:
 *         description: Validation failed or fields already in use
 *         content:
 *           application/json:
 *             example:
 *               status: false
 *               message: "These fields are already in use: email"
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
 *         description: No dentist found
 *         content:
 *           application/json:
 *             example:
 *               status: false
 *               message: "No Dentist found"
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

    if (
      token.role === TokenRoles.DENTALLY_PRACTITIONER ||
      token.role === TokenRoles.REFERRING_DENTIST
    ) {
      const dentistSub = token.sub ?? "";

      const dentist =
        token.role === TokenRoles.DENTALLY_PRACTITIONER
          ? await prisma.dentist.findFirst({
              where: {
                dentallyId: Number.isFinite(Number(dentistSub))
                  ? Number(dentistSub)
                  : undefined,
              },
            })
          : await prisma.dentist.findUnique({
              where: { id: dentistSub },
            });

      if (!dentist) {
        return NextResponse.json(
          createResponse(false, "No Dentist found", dentist),
          { status: 404 },
        );
      }

      const dentistId = dentist.id;
      const request = await prisma.dentistOnPractice.findFirst({
        where: { dentistId },
        include: { dentist: true, practice: true },
      });

      return NextResponse.json(
        createResponse(
          true,
          "Dentist record successfully fetched",

          {
            dentist,
            request,
          },
        ),
        { status: 200 },
      );
    } else if (token.role === TokenRoles.ADMIN) {
      const dentists = await prisma.dentist.findMany({});

      if (dentists.length < 1) {
        return NextResponse.json(
          createResponse(false, "No Dentist found", null),
        );
      }

      return NextResponse.json(
        createResponse(true, "Dentists fetched successfully", dentists),
      );
    } else {
      return NextResponse.json(createResponse(false, "Forbidden", null), {
        status: 403,
      });
    }
  } catch (error) {
    console.log("Error in fetching dentists ", error);
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

    if (token.role === TokenRoles.ADMIN || token.role === TokenRoles.PATIENT) {
      return NextResponse.json(createResponse(false, "Forbidden", null), {
        status: 403,
      });
    }

    const dentistSub = token.sub ?? "";
    const dentist =
      token.role === TokenRoles.DENTALLY_PRACTITIONER
        ? await prisma.dentist.findFirst({
            where: {
              dentallyId: Number.isFinite(Number(dentistSub))
                ? Number(dentistSub)
                : undefined,
            },
          })
        : await prisma.dentist.findUnique({
            where: { id: dentistSub },
          });

    if (!dentist) {
      return NextResponse.json(
        createResponse(false, "No Dentist found", null),
        { status: 404 },
      );
    }

    const dentistId = dentist.id;

    const partialDentist = await req.json();
    const email = partialDentist?.email;
    const gdc = partialDentist?.gdcNo;
    const firstName = partialDentist?.firstName;
    const lastName = partialDentist?.lastName;
    const fullName = partialDentist?.fullName;
    const fileUrl = partialDentist?.fileUrl;

    const updateData: Record<string, unknown> = {};
    if (typeof email === "string" && email.trim()) updateData.email = email;
    if (typeof gdc === "string" && gdc.trim()) updateData.gdcNo = gdc;
    if (typeof firstName === "string" && firstName.trim())
      updateData.firstName = firstName;
    if (typeof lastName === "string" && lastName.trim())
      updateData.lastName = lastName;
    if (typeof fileUrl === "string" && fileUrl.trim())
      updateData.fileUrl = fileUrl;

    if (
      typeof fullName === "string" &&
      fullName.trim() &&
      typeof updateData.firstName !== "string" &&
      typeof updateData.lastName !== "string"
    ) {
      const parts = fullName.trim().split(/\s+/);
      updateData.firstName = parts[0] ?? "";
      updateData.lastName = parts.slice(1).join(" ");
    }

    if (Object.keys(updateData).length === 0) {
      return NextResponse.json(
        createResponse(false, "No valid fields provided", null),
        { status: 400 },
      );
    }

    const existingDentist = await prisma.dentist.findFirst({
      where: {
        id: { not: dentistId },
        OR: [
          ...(typeof email === "string" && email.trim() ? [{ email }] : []),
          ...(typeof gdc === "string" && gdc.trim() ? [{ gdcNo: gdc }] : []),
        ],
      },
    });

    const respose =
      typeof email === "string" && email.trim()
        ? await getPatient({ emailAddress: email })
        : null;
    if (respose?.isError) {
      return respose.response;
    }
    const existingPatients = respose?.response?.patients ?? null;

    const existingAdmin =
      typeof email === "string" && email.trim()
        ? await prisma.admin.findFirst({
            where: { email },
          })
        : null;

    // if (existingDentist || existingPatient || existingAdmin) {
    //   return NextResponse.json(
    //     createResponse(false, "User data already exists", null),
    //     { status: 400 }
    //   );
    // }

    const conflicts: string[] = [];

    if (existingDentist) {
      if (typeof email === "string" && existingDentist.email === email)
        conflicts.push("email");
      if (typeof gdc === "string" && existingDentist.gdcNo === gdc)
        conflicts.push("GDC number");
    }

    if (
      typeof email === "string" &&
      Array.isArray(existingPatients) &&
      existingPatients.some((p: any) => p?.email === email)
    ) {
      conflicts.push("email");
    }

    if (existingAdmin) {
      if (typeof email === "string" && existingAdmin.email === email)
        conflicts.push("email");
    }

    const uniqueConflicts = Array.from(new Set(conflicts));

    if (uniqueConflicts.length > 0) {
      return NextResponse.json(
        createResponse(
          false,
          `These fields are already in use: ${uniqueConflicts.join(", ")}`,
          null,
        ),
        { status: 400 },
      );
    }

    const updatedDentist = await prisma.dentist.update({
      where: { id: dentistId },
      data: updateData,
    });

    return NextResponse.json(
      createResponse(true, "Dentist is updated successfully", updatedDentist),
      { status: 200 },
    );
  } catch (error) {
    console.log("Error in updated dentist", error);
    const errorMessage = error instanceof Error ? error.message : String(error);
    return NextResponse.json(createResponse(false, errorMessage, null), {
      status: 500,
    });
  }
}
