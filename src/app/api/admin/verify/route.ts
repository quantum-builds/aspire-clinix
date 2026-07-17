import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import { createResponse } from "@/utils/createResponse";
import { generateOtp } from "@/utils/generateOtp";
import bcrypt from "bcryptjs";
import sendgrid from "@/config/sendgrid-config";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    console.log("VERIFY ADMIN BODY:", body);
    const { fullName, email, phoneNumber, password } = body;

    if (!fullName) {
      return NextResponse.json(
        createResponse(false, "Full name is required", null),
        { status: 400 },
      );
    }
    if (!phoneNumber) {
      return NextResponse.json(
        createResponse(false, "Phone number is required", null),
        { status: 400 },
      );
    }
    if (!email) {
      return NextResponse.json(
        createResponse(false, "Email is required", null),
        { status: 400 },
      );
    }
    if (!password) {
      return NextResponse.json(
        createResponse(false, "Password is required", null),
        { status: 400 },
      );
    }

   const existingAdmin = await prisma.admin.findFirst({
      where: {
        OR: [{ email }, { phoneNumber }],
      },
    });

    if (!existingAdmin) {
      const  existingPendingAdmin = await prisma.pendingAdmin.findFirst({
        where: {
          OR: [{ email }, { phoneNumber }],
        },
      });
      console.log("existingPendingAdmin:", existingPendingAdmin);
      if (existingPendingAdmin) {
        return NextResponse.json(
          createResponse(
            false,
            "Admin with this email or phone number already exists",
            null,
          ),
          { status: 400 },
        );
      }
    } else {
      console.log("existingAdmin:", existingAdmin);
      return NextResponse.json(
        createResponse(
          false,
          "Admin with this email or phone number already exists",
          null,
        ),
        { status: 400 },
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const otp = generateOtp();
    const otpInvalidationTime = new Date(Date.now() + 15 * 60 * 1000);

    const admin = await prisma.pendingAdmin.create({
      data: {
        password: hashedPassword,
        email,
        phoneNumber,
        fullName,
        otp,
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
      text: "undefined",
    });
    return NextResponse.json(
      createResponse(true, "Admin wait the super admin approval", admin),
      { status: 201 },
    );
  } catch (error: any) {
   

    return NextResponse.json(
      createResponse(false, error?.response?.body || error.message, null),
      {
        status: 500,
      },
    );
  }
}
