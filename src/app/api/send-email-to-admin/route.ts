import { NextRequest, NextResponse } from "next/server";
import { createResponse } from "@/utils/createResponse";
import prisma from "@/lib/db";
import { sendEmail } from "@/lib/emailService";
export async function POST(req: NextRequest) {

    const { subject, html } = await req.json();

    if (!subject || !html) {
      return NextResponse.json(
        createResponse(false, "Subject and HTML are required.", null),
        { status: 400 },
      );
    }
  try {
    const admins = await prisma.admin.findMany({ select: { email: true } });
    const emails = admins.map((a) => a.email).filter(Boolean) as string[];
    if (emails.length === 0) {
      console.warn("[EmailService] No admin emails found");
      return;
    }
    await Promise.all(
      emails.map((email) => sendEmail({ to: email, subject, html })),
    );
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    return NextResponse.json(createResponse(false, errorMessage, null), {
      status: 500,
    });
  }
}
