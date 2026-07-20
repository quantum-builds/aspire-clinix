import sendgrid from "@/config/sendgrid-config";
import prisma from "@/lib/db";

interface EmailPayload {
  to: string;
  subject: string;
  html: string;
}

export async function sendEmail({ to, subject, html }: EmailPayload): Promise<void> {
  if (!to || !process.env.EMAIL_FROM) {
    console.warn(`[EmailService] Skipping — missing to (${to}) or EMAIL_FROM`);
    return;
  }
  try {
    await sendgrid.send({
      from: { email: process.env.EMAIL_FROM, name: "Aspire Clinic" },
      to,
      subject,
      html,
      text: "undefined",
    });
  } catch (err) {
    console.error(`[EmailService] Failed to send to ${to}:`, err);
  }
}

export async function sendEmailToAdmins({ subject, html }: Omit<EmailPayload, 'to'>): Promise<void> {
  try {
    const admins = await prisma.admin.findMany({ select: { email: true } });
    const emails = admins.map(a => a.email).filter(Boolean) as string[];
    if (emails.length === 0) {
      console.warn("[EmailService] No admin emails found");
      return;
    }
    await Promise.allSettled(
      emails.map(email => sendEmail({ to: email, subject, html }))
    );
  } catch (err) {
    console.error("[EmailService] Failed to send admin emails:", err);
  }
}
