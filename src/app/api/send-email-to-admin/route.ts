import { NextRequest, NextResponse } from "next/server";
import { createResponse } from "@/utils/createResponse";
import { sendEmailToAdmins } from "@/lib/emailService";
export async function POST(req: NextRequest) {
  const { subject, html } = await req.json();

  if (!subject || !html) {
    return NextResponse.json(
      createResponse(false, "Subject and HTML are required.", null),
      { status: 400 },
    );
  }

  try {
    await sendEmailToAdmins({ subject, html });
    return NextResponse.json(
      createResponse(true, "Email sent to admins successfully.", null),
      { status: 200 },
    );
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    return NextResponse.json(createResponse(false, errorMessage, null), {
      status: 500,
    });
  }
}
