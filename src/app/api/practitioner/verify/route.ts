import sendgrid from "@/config/sendgrid-config";
import { getPractitioners } from "@/dentallyHelpers/practitioners";
import prisma from "@/lib/db";
import { UserRoles } from "@/types/common";
import { createResponse } from "@/utils/createResponse";
import { generateOtp } from "@/utils/generateOtp";
import { NextRequest, NextResponse } from "next/server";

/**
 * @swagger
 * /api/practitioner/verify:
 *   post:
 *     summary: Verify practitioner details and send OTP
 *     tags: [Practitioner]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - gdcNumber
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *               gdcNumber:
 *                 type: string
 *     responses:
 *       200:
 *         description: OTP code sent successfully
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               message: "OTP code send successfully"
 *               data:
 *                 id: "prac_01HXYZ1234ABCDE"
 *                 email: "dentist@example.com"
 *                 role: "DENTIST"
 *                 name: "Sarah Ahmed"
 *                 image: null
 *       400:
 *         description: Email and GDC Number are required
 *         content:
 *           application/json:
 *             example:
 *               status: false
 *               message: "Email and GDC Number are required"
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
 *               message: "Multiple accounts found. Please contact Aspire support."
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
export default async function POST(req: NextRequest) {
  try {
    const { email, gdcNumber } = await req.json();

    if (!email || !gdcNumber) {
      return NextResponse.json(
        createResponse(false, "Email and GDC Number are required", null),
        { status: 400 },
      );
    }

    const response = await getPractitioners();

    if (response.isError) {
      return NextResponse.json(
        createResponse(false, "No account found", null),
        { status: 404 },
      );
    }

    const normalizedEmail = email.trim().toLowerCase();
    const normalizedGdcNumber = gdcNumber.trim().toLowerCase();

    const filteredPractitioners = (response.response ?? []).filter(
      (practitioner: any) =>
        practitioner?.user?.email?.trim?.().toLowerCase?.() ===
          normalizedEmail &&
        practitioner?.gdc_Number?.trim?.().toLowerCase?.() ===
          normalizedGdcNumber,
    );

    if (filteredPractitioners.length === 0) {
      return NextResponse.json(
        createResponse(false, "No account found with these details", null),
        { status: 404 },
      );
    }

    if (filteredPractitioners.length > 1) {
      return NextResponse.json(
        createResponse(
          false,
          "Multiple accounts found. Please contact Aspire support.",
          null,
        ),
        { status: 409 },
      );
    }

    const matchedPractitioner = filteredPractitioners[0];
    const firstName = matchedPractitioner?.user?.first_name?.trim?.() ?? "";
    const lastName = matchedPractitioner?.user?.last_name?.trim?.() ?? "";
    const fullName = `${firstName} ${lastName}`.trim() || normalizedEmail;
    const otp = generateOtp();

    const existingDentist = await prisma.dentist.findFirst({
      where: {
        email: normalizedEmail,
        gdcNo: normalizedGdcNumber,
      },
    });

    let user = null;
    if (!existingDentist) {
      user = await prisma.dentist.create({
        data: {
          email: normalizedEmail,
          gdcNo: normalizedGdcNumber,
          dentallyId: matchedPractitioner.id,
          firstName: matchedPractitioner.user.first_name,
          lastName: matchedPractitioner.use.last_name,
          otp,
          otpInvalidationTime: new Date(Date.now() + 15 * 60 * 1000),
        },
      });
    } else {
      user = await prisma.dentist.update({
        where: { id: existingDentist.id },
        data: {
          otp,
          otpInvalidationTime: new Date(Date.now() + 15 * 60 * 1000),
        },
      });
    }

    const html = `
            <div style="font-family: Arial, sans-serif; line-height: 1.5; color: #111827;">
              <p>Hi ${fullName},</p>
              <p>Your one-time password is:</p>
              <div style="font-size: 24px; font-weight: 700; letter-spacing: 4px; margin: 16px 0;">
                ${otp}
              </div>
              <p>This code expires in 15 minutes.</p>
            </div>
          `;

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

    await sendgrid.send({
      from: process.env.EMAIL_FROM,
      to: normalizedEmail,
      subject: "Your Aspire OTP code",
      html,
      text: undefined,
    });

    const data = {
      id: user.id,
      email: user.email,
      role: UserRoles.DENTIST,
      name: fullName,
      image: null,
    };

    return NextResponse.json(
      createResponse(true, "OTP code send successfully", data),
      { status: 200 },
    );
  } catch (error) {
    console.log("Error in verifying email ", error);
    const errorMessage = error instanceof Error ? error.message : String(error);
    return NextResponse.json(createResponse(false, errorMessage, null), {
      status: 500,
    });
  }
}
