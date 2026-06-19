import sendgrid from "@/config/sendgrid-config";
import { TokenRoles } from "@/constants/UserRoles";
import { getPatient } from "@/dentallyHelpers/patient";
import prisma from "@/lib/db";
import { createResponse } from "@/utils/createResponse";
import { generateOtp } from "@/utils/generateOtp";
import { NextRequest, NextResponse } from "next/server";

/**
 * @swagger
 * /api/patient/verify:
 *   post:
 *     summary: Verify patient details and send OTP
 *     tags: [Patient]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - firstName
 *               - lastName
 *               - mobilePhone
 *               - dateOfBirth
 *               - email
 *             properties:
 *               firstName:
 *                 type: string
 *               lastName:
 *                 type: string
 *               mobilePhone:
 *                 type: string
 *               dateOfBirth:
 *                 type: string
 *                 format: date
 *               email:
 *                 type: string
 *                 format: email
 *     responses:
 *       200:
 *         description: OTP code sent successfully
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               message: "OTP code send successfully"
 *               data:
 *                 id: "pat_01HXYZ1234ABCDE"
 *                 email: "john.doe@example.com"
 *                 role: "PATIENT"
 *                 name: "John Doe"
 *                 familyId: "fam_01HXYZ1234ABCDE"
 *                 image: null
 *       400:
 *         description: Missing required fields
 *         content:
 *           application/json:
 *             example:
 *               status: false
 *               message: "All fields are required"
 *               data: null
 *       404:
 *         description: No account found
 *         content:
 *           application/json:
 *             example:
 *               status: false
 *               message: "No account found"
 *               data: null
 *       409:
 *         description: Multiple accounts found
 *         content:
 *           application/json:
 *             example:
 *               status: false
 *               message: "Multiple accounts found"
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

export async function POST(req: NextRequest) {
  try {
    const { firstName, lastName, mobilePhone, dateOfBirth, email } =
      await req.json();

    if (!firstName || !lastName || !mobilePhone || !dateOfBirth || !email) {
      return NextResponse.json(
        createResponse(false, "All fields are required", null),
        { status: 400 },
      );
    }

    const response = await getPatient({
      firstName,
      lastName,
      mobilePhone,
      dateOfBirth,
      emailAddress: email,
    });



    if (response.isError) {
      return NextResponse.json(
        createResponse(false, `Error in fetching data from dentally`, null),
        { status: 400 },
      );
    }

    let activePatients = (response.response.patients ?? []).filter(
      (patient: any) => patient.active && !patient.archivedReason,
    );
     if (activePatients.length > 1) {
      const matchingPatients = activePatients.filter(
        (patient: any) =>
          patient.firstName === firstName &&
          patient.lastName === lastName,
      );

      activePatients = matchingPatients;
    }

   
    if (activePatients.length === 0 || activePatients.length > 1) {
      return NextResponse.json(
        createResponse(false, "No Account found", null),
        { status: 404 },
      );
    }

    let active = activePatients[0];

    const fullName =
      `${active?.firstName ?? firstName} ${active?.lastName ?? lastName}`.trim();
    let patient = null;

    const dentallyPatientId = active?.id;

    const existingPatient = await prisma.patient.findUnique({
      where: {
        dentallyId: dentallyPatientId,
      },
    });

    if (!existingPatient) {
      patient = await prisma.patient.create({
        data: {
          uuid: String(active?.uuid),
          dentallyId: dentallyPatientId,
          mobileNumber: mobilePhone,
          name: fullName,
          dateOfBirth: dateOfBirth,
          email: email,
          familyId: active?.familyId,
          otp: generateOtp(),
          otpInvalidationTime: new Date(Date.now() + 15 * 60 * 1000),
        },
      });
    } else {
      patient = await prisma.patient.update({
        where: { id: existingPatient.id },
        data: {
          mobileNumber: mobilePhone,
          name: fullName,
          dateOfBirth: dateOfBirth,
          email: email,
          familyId: active?.familyId,
          otp: generateOtp(),
          otpInvalidationTime: new Date(Date.now() + 15 * 60 * 1000),
        },
      });
    }

    if (!process.env.EMAIL_FROM) {
      return NextResponse.json(
        createResponse(
          false,
          "Email configuration is missing (EMAIL_FROM is not set)",
          null,
        ),
        { status: 500 },
      );
    }

    const html = `
      <div style="font-family: Arial, sans-serif; line-height: 1.5; color: #111827;">
        <p>Hi ${fullName},</p>
        <p>Your one-time password is:</p>
        <div style="font-size: 24px; font-weight: 700; letter-spacing: 4px; margin: 16px 0;">
          ${patient.otp}
        </div>
        <p>This code expires in 15 minutes.</p>
      </div>
    `;

    await sendgrid.send({
      from: process.env.EMAIL_FROM,
      to: email,
      subject: "Your Aspire OTP code",
      html,
      text: undefined,
    });

    return NextResponse.json(
      createResponse(true, "OTP code send successfully", {
        id: patient.id,
        dentallyId: patient.dentallyId,
        email: email,
        role: TokenRoles.PATIENT,
        name: fullName,
        familyId: patient.familyId,
        image: null,
      }),
      { status: 200 },
    );
  } catch (error) {
    console.error("Error in patients verification:", error);
    const errorMessage = error instanceof Error ? error.message : String(error);
    return NextResponse.json(createResponse(false, errorMessage, null), {
      status: 500,
    });
  }
}
