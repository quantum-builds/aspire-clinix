import prisma from "@/lib/db";
import resend from "@/config/resend-config";

interface EmailPayload {
  to: string;
  subject: string;
  html: string;
}

export async function sendEmail({ to, subject, html }: EmailPayload): Promise<void> {
  if (!to) {
    return;
  }
  if (!process.env.EMAIL_FROM) {
    console.error("[EmailService] EMAIL_FROM is not set; skipping email send.");
    return;
  }
  try {
    await resend.emails.send({
      from: `Aspire Clinic <${process.env.EMAIL_FROM}>`,
      to,
      subject,
      html,
      replyTo: process.env.REPLAY_TO_EMAIL || process.env.EMAIL_FROM,
    });
  } catch (err) {
    console.error(`[EmailService] Failed to send to ${to}:`, err);
  }
}

export async function sendEmailToAdmins({
  subject,
  html,
}: {
  subject: string;
  html: string;
}): Promise<void> {
  try {
    const admins = await prisma.admin.findMany({ select: { email: true } });
    const emails = admins.map((a) => a.email).filter(Boolean) as string[];

    if (emails.length === 0) {
      console.warn("[EmailService] No admin emails found");
      return;
    }

    await Promise.allSettled(
      emails.map((email) => sendEmail({ to: email, subject, html })),
    );
  } catch (err) {
    console.error("[EmailService] Failed to send email to admins:", err);
  }
}
