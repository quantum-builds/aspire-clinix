import { TokenRoles } from "@/constants/UserRoles";
import { NextResponse, NextRequest } from "next/server";
import { createPatient, getPatient } from "@/dentallyHelpers/patient";
import prisma from "@/lib/db";
import { DentistRole } from "@prisma/client";
import { getPractitioners } from "@/dentallyHelpers/practitioners";
import { createResponse } from "@/utils/createResponse";

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *               - role
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: patient@example.com
 *               password:
 *                 type: string
 *                 example: StrongPassword123!
 *               role:
 *                 type: string
 *                 enum: [DENTIST, PATIENT]
 *                 example: PATIENT
 *               title:
 *                 type: string
 *                 example: Mr
 *               firstName:
 *                 type: string
 *                 example: John
 *               lastName:
 *                 type: string
 *                 example: Doe
 *               mobilePhone:
 *                 type: string
 *                 example: "+447700900123"
 *               addressLine1:
 *                 type: string
 *                 example: 10 High Street
 *               postCode:
 *                 type: string
 *                 example: SW1A 1AA
 *               dateOfBirth:
 *                 type: string
 *                 format: date
 *                 example: 1990-01-01
 *     responses:
 *       201:
 *         description: User registered successfully
 *         content:
 *           application/json:
 *             example:
 *               message: "User registered successfully"
 *       400:
 *         description: Validation failed or patient lookup/create failed
 *         content:
 *           application/json:
 *             example:
 *               message: "Email, password and role are required"
 *       404:
 *         description: No account found
 *         content:
 *           application/json:
 *             example:
 *               message: "No Account Found"
 *       409:
 *         description: Multiple matching accounts found
 *         content:
 *           application/json:
 *             example:
 *               message: "No Account Found"
 *       405:
 *         description: Method not allowed
 *         content:
 *           application/json:
 *             example:
 *               message: "Method not allowed"
 *       500:
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             example:
 *               message: "Internal server error"
 */
export async function POST(req: NextRequest) {
  const { role } = await req.json();

  if (!role) {
    return NextResponse.json(
      { message: "Role are required" },
      { status: 400 },
    );
  }

  if (role !== TokenRoles.REFERRING_DENTIST && role !== TokenRoles.PATIENT) {
    return NextResponse.json({ messsage: "Role is invalid" }, { status: 400 });
  }

  try {
    if (role === TokenRoles.PATIENT) {
      const {
        title,
        firstName,
        lastName,
        mobilePhone,
        email,
        addressLine1,
        postCode,
        dateOfBirth,
      } = await req.json();

      const response = await getPatient({
        firstName,
        lastName,
      });

      if (response.isError)
        return NextResponse.json(
          { message: "Failed to get patient" },
          { status: 400 },
        );

      if (Array.isArray(response.response) && response.response.length > 0)
        return NextResponse.json(
          { message: "Account with these names already exist" },
          { status: 409 },
        );

      const createRes = await createPatient({
        title,
        firstName,
        lastName,
        mobilePhone,
        email,
        addressLine1,
        postCode,
        dateOfBirth,
      });

      if (createRes.isError)
        return NextResponse.json(
          { message: "Failed to create patient" },
          { status: 400 },
        );

      const patientData = createRes.response;
      const fullName = `${firstName} ${lastName}`

      await prisma.patient.create({
        data: {
          uuid: patientData.uuid,
          dentallyId: patientData.id,
          mobileNumber: mobilePhone,
          email: email,
          name: fullName,
          dateOfBirth: dateOfBirth,
          familyId: patientData.familyId,
        },
      });
    } else if (role === TokenRoles.REFERRING_DENTIST) {
      const {
        gdcNo,
        firstName,
        lastName,
        email,
      } = await req.json();

      const practitionersResponse = await getPractitioners();

      if (practitionersResponse.isError) {
        return NextResponse.json(
          createResponse(false, "Failed to verify practitioner", null),
          { status: 400 },
        );
      }

      // Check if email or GDC number exists in Dentally practitioners
      const practitioners = practitionersResponse.response || [];
      const existingPractitioner = practitioners.find(
        (p: any) => p.user.email === email || p.gdc_number === gdcNo
      );

      if (!existingPractitioner) {
        return NextResponse.json(
          { message: "No practitioner found with this email or GDC number" },
          { status: 404 },
        );
      }

      // Check if dentist already registered in our system
      const existingDentist = await prisma.dentist.findFirst({
        where: {
          OR: [{ email }, { gdcNo }],
        },
      });

      if (existingDentist) {
        return NextResponse.json(
          { message: "Account with this info already exist" },
          { status: 409 },
        );
      }

      await prisma.dentist.create({
        data: {
          email,
          gdcNo,
          firstName,
          lastName,
          role: DentistRole.REFERRING_DENTIST,
        },
      });
    }

    return NextResponse.json(
      { message: "User registered successfully" },
      { status: 201 },
    );
  } catch (err) {
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 },
    );
  }
}
