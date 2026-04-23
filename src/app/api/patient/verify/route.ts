import sendgrid from "@/config/sendgrid-config";
import { getPatient } from "@/dentallyHelpers/patient";
import prisma from "@/lib/db";
import { UserRoles } from "@/types/common";
import { createResponse } from "@/utils/createResponse";
import { generateOtp } from "@/utils/generateOtp";
import { NextRequest, NextResponse } from "next/server";
import { act } from "react";

export default async function POST(req: NextRequest) {
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
    });

    if (response.isError) {
      throw new Error("No account found");
    }

    const activePatients = response.response.filter(
      (patient: any) => patient.active && !patient.archived_reason,
    );

    if (activePatients.length === 0 || activePatients.length > 1) {
      throw new Error("No account found");
    }

    let active = activePatients[0];
    const fullName =
      `${active?.firstName ?? firstName} ${active?.lastName ?? lastName}`.trim();
    let patient = null;

    const existingPatient = await prisma.patient.findFirst({
      where: {
        dentallyId: active?.dentallyId,
      },
    });

    if (!existingPatient) {
      patient = await prisma.patient.create({
        data: {
          id: active?.id,
          uuid: String(active?.uuid),
          dentallyId: active?.dentallyId,
          mobileNumber: mobilePhone,
          firstName: firstName,
          lastName: lastName,
          dateOfBirth: dateOfBirth,
          email: email,
          otp: generateOtp(),
          otpInvalidationTime: new Date(Date.now() + 15 * 60 * 1000),
        },
      });
    } else {
      patient = await prisma.patient.update({
        where: { id: active?.id },
        data: {
          mobileNumber: mobilePhone,
          firstName: firstName,
          lastName: lastName,
          dateOfBirth: dateOfBirth,
          email: email,
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
          ${generateOtp}
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
        email: email,
        role: UserRoles.PATIENT,
        name: fullName,
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
