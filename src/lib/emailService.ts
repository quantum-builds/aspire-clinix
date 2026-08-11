import prisma from "@/lib/db";
import resend from "@/config/resend-config";
import { useSendEmailToAdmin } from "@/services/adminEmailServices";

interface EmailPayload {
  to: string;
  subject: string;
  html: string;
}

export async function sendEmail({ to, subject, html }: EmailPayload): Promise<void> {
  if (!to || !process.env.EMAIL_FROM) {
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


