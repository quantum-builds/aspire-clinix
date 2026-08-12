import prisma from "@/lib/db";
import { sendEmail } from "@/lib/emailService";
import {
  assignedPractitionerEmail,
  assignedReferringDentistEmail,
  assignedPatientEmail,
  AdminEmail,
  responseAdminEmail,
  responseReferringDentistEmail,
  responsePatientEmail,
  ReferralNotificationData,
  bindPatientEmail,
  bindReferringDentistEmail,
  bindPractitionerEmail,
  referralCreatedAdminEmail,
} from "@/constants/referralEmailTemplates";
import { useSendEmailToAdmin } from "@/services/adminEmailServices";

async function buildNotificationData(referralRequestId: string): Promise<ReferralNotificationData | null> {
  try {
    const referral = await prisma.referralRequest.findUnique({
      where: { id: referralRequestId },
      include: {
        referralForm: {
          include: {
            patient: true,
            referralDentist: true,
          },
        },
      },
    });

    if (!referral?.referralForm) return null;

    const assignedDentist = referral.assignedDentistId
      ? await prisma.dentist.findUnique({ where: { id: referral.assignedDentistId } })
      : null;

    return {
      patientName: referral.referralForm.patientName,
      patientEmail: referral.referralForm.patientEmail,
      practitionerName: assignedDentist
        ? `${assignedDentist.firstName} ${assignedDentist.lastName}`.trim()
        : undefined,
      practitionerEmail: assignedDentist?.email ?? undefined,
      referringDentistName: referral.referralForm.referralName ?? undefined,
      referringDentistEmail: referral.referralForm.referralEmail ?? undefined,
      treatmentDetails: referral.referralForm.treatmentDetails ?? undefined,
      hasAppointment: !!referral.appointmentId,
      action: (referral.requestStatus === "ACCEPTED" || referral.requestStatus === "REJECTED")
        ? referral.requestStatus
        : undefined,
      comments: referral.dentistComments ?? undefined,
      proposedTreatmentDetails: referral.proposedTreatmentDetails ?? undefined,
      proposedConsultationTime: referral.proposedConsultationTime ?? undefined,
    };
  } catch (err) {
    console.error(`[ReferralNotification] Failed to build data for ${referralRequestId}:`, err);
    return null;
  }
}
// its is triggered when a appointment is bind for a referral by ==>> Admin
export async function notifyReferralAppointmentBound(referralRequestId: string): Promise<void> {
  const data = await buildNotificationData(referralRequestId);
  if (!data) return;

  await Promise.allSettled([
    data.practitionerEmail &&
      sendEmail({
        to: data.practitionerEmail,
        subject: "Appointment booked \u2014 referral update",
        html: bindPractitionerEmail(data),
      }),
    data.referringDentistEmail &&
      sendEmail({
        to: data.referringDentistEmail,
        subject: "Appointment booked for your referral",
        html: bindReferringDentistEmail(data),
      }),
    sendEmail({
      to: data.patientEmail,
      subject: "Your appointment has been booked",
      html: bindPatientEmail(data),
    }),
   
  ]);
}
// its is triggered when a referral is assigned to a Dentally dentist by ==>> Admin
export async function notifyReferralDentistAssigned(referralRequestId: string): Promise<void> {
  const data = await buildNotificationData(referralRequestId);
  if (!data) return;

  await Promise.allSettled([
    data.practitionerEmail &&
      sendEmail({
        to: data.practitionerEmail,
        subject: "New referral assigned to you",
        html: assignedPractitionerEmail(data),
      }),
    data.referringDentistEmail &&
      sendEmail({
        to: data.referringDentistEmail,
        subject: "Your referral has been assigned",
        html: assignedReferringDentistEmail(data),
      }),
    sendEmail({
      to: data.patientEmail,
      subject: "Your referral has been assigned",
      html: assignedPatientEmail(data),
    }),
   
  ]);
}

/// its triggered when a referral is accepted or rejected by the ==>>Dentally dentist. 
export async function notifyReferralResponded(referralRequestId: string): Promise<void> {
  const data = await buildNotificationData(referralRequestId);
  if (!data) return;

   const { mutateAsync: sendEmailToAdmin } = useSendEmailToAdmin();

  await Promise.allSettled([
    data.referringDentistEmail &&
      sendEmail({
        to: data.referringDentistEmail,
        subject: `Referral ${data.action === "ACCEPTED" ? "accepted" : "rejected"}`,
        html: responseReferringDentistEmail(data),
      }),
    sendEmail({
      to: data.patientEmail,
      subject: `Your referral has been ${data.action === "ACCEPTED" ? "accepted" : "rejected"}`,
      html: responsePatientEmail(data),
    }),
    sendEmailToAdmin({
      subject: `Referral ${data.action === "ACCEPTED" ? "accepted" : "rejected"} by practitioner`,
      html: responseAdminEmail(data),
    }),
  ]);
}

export async function notifyReferralCreated(referralForm: any): Promise<void> {
   const { mutateAsync: sendEmailToAdmin } = useSendEmailToAdmin();
  try {
    const req = await prisma.referralRequest.findUnique({
      where: { referralFormId: referralForm.id },
      select: { id: true },
    });
    if (!req) return;

    const rawBase = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3000/";
    const base = rawBase.endsWith("/") ? rawBase.slice(0, -1) : rawBase;
    const referralLink = `${base}/clinic/referrals/${req.id}/unassigned`;

    await sendEmailToAdmin({
      subject: `New referral submitted for ${referralForm.patientName}`,
      html: referralCreatedAdminEmail(referralForm, referralLink),
    });
  } catch (err) {
    console.error("[ReferralNotification] Failed to notify admins:", err);
  }
}
