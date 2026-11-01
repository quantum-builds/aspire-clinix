import prisma from "@/lib/db";
import resend from "@/config/resend-config";

interface EmailPayload {
  to: string;
  subject: string;
  html: string;
  /** "wellness" sends from WELLNESS_EMAIL_FROM as "Aspire Wellness". */
  sender?: "clinic" | "wellness";
}

function resolveSender(sender: "clinic" | "wellness") {
  if (sender === "wellness") {
    if (process.env.WELLNESS_EMAIL_FROM) {
      return {
        from: `Aspire Wellness <${process.env.WELLNESS_EMAIL_FROM}>`,
        replyTo: process.env.WELLNESS_EMAIL_FROM,
      };
    }
    console.error(
      "[EmailService] WELLNESS_EMAIL_FROM is not set; sending from EMAIL_FROM.",
    );
  }
  return {
    from: `Aspire Clinic <${process.env.EMAIL_FROM}>`,
    replyTo: process.env.REPLAY_TO_EMAIL || process.env.EMAIL_FROM,
  };
}

export async function sendEmail({
  to,
  subject,
  html,
  sender = "clinic",
}: EmailPayload): Promise<void> {
  if (!to) {
    return;
  }
  if (!process.env.EMAIL_FROM) {
    console.error("[EmailService] EMAIL_FROM is not set; skipping email send.");
    return;
  }
  try {
    const { from, replyTo } = resolveSender(sender);
    // Resend returns { data, error } instead of throwing on API errors.
    const { error } = await resend.emails.send({
      from,
      to,
      subject,
      html,
      replyTo,
    });
    if (error) {
      console.error(`[EmailService] Resend rejected email to ${to}:`, error);
    }
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
