import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import { createResponse } from "@/utils/createResponse";
import { generateOtp } from "@/utils/generateOtp";
import bcrypt from "bcryptjs";
import sendgrid from "@/config/sendgrid-config";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { fullName, email, mobilePhone, password } = body.verifyAdmin || body;

    if (!fullName || !mobilePhone || !email || !password) {
      return NextResponse.json(
        createResponse(false, "All fields are required", null),
        { status: 400 },
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const opt = generateOtp();
    const otpInvalidationTime = new Date(Date.now() + 15 * 60 * 1000);

    const admin = await prisma.pendingAdmin.create({
      data: {
        password: hashedPassword,
        email,
        mobilePhone,
        fullName,
        opt,
        otpInvalidationTime,
      },
    });
    const html = `
          <div style="font-family: Arial, sans-serif; line-height: 1.5; color: #111827;">
            <p>Your one-time password is:</p>
            <div style="font-size: 24px; font-weight: 700; letter-spacing: 4px; margin: 16px 0;">
              ${admin.otp}
            </div>
            <p>This code expires in 15 minutes.</p>
          </div>
        `;

    await sendgrid.send({
      from: {
        email: process.env.EMAIL_FROM!,
        name: "Aspire Clinic",
      },
      to: process.env.EMAIL_TO!,
      subject: "Your Aspire OTP code",
      html,
      text: "",
    });
    return NextResponse.json(
      createResponse(true, "Admin wait the super admin approval", admin),
      { status: 201 },
    );
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    return NextResponse.json(createResponse(false, errorMessage, null), {
      status: 500,
    });
  }
}
