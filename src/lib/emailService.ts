import sendgrid from "@/config/sendgrid-config";
import prisma from "@/lib/db";
import resend from "@/config/resend-config";

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
    });
  } catch (err) {
    console.error(`[EmailService] Failed to send to ${to}:`, err);
  }
}

export async function sendEmailToAdmins({ subject, html }: Omit<EmailPayload, 'to'>): Promise<void> {
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
    console.error("[EmailService] Failed to send admin emails:", err);
  }
}
