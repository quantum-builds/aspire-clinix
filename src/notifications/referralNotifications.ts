import prisma from "@/lib/db";
import { sendEmail, sendEmailToAdmins } from "@/lib/emailService";
import {
  assignedPractitionerEmail,
  assignedReferringDentistEmail,
  assignedPatientEmail,
  assignedAdminEmail,
  responseAdminEmail,
  responseReferringDentistEmail,
  responsePatientEmail,
  ReferralNotificationData,
} from "@/constants/referralEmailTemplates";

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
    };
  } catch (err) {
    console.error(`[ReferralNotification] Failed to build data for ${referralRequestId}:`, err);
    return null;
  }
}

export async function notifyReferralAppointmentBound(referralRequestId: string): Promise<void> {
  const data = await buildNotificationData(referralRequestId);
  if (!data) return;

  await Promise.allSettled([
    data.practitionerEmail &&
      sendEmail({
        to: data.practitionerEmail,
        subject: "Appointment booked \u2014 referral update",
        html: assignedPractitionerEmail(data),
      }),
    data.referringDentistEmail &&
      sendEmail({
        to: data.referringDentistEmail,
        subject: "Appointment booked for your referral",
        html: assignedReferringDentistEmail(data),
      }),
    sendEmail({
      to: data.patientEmail,
      subject: "Your appointment has been booked",
      html: assignedPatientEmail(data),
    }),
    sendEmailToAdmins({
      subject: "Referral appointment bound",
      html: assignedAdminEmail(data),
    }),
  ]);
}

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
    sendEmailToAdmins({
      subject: "Referral assigned to practitioner",
      html: assignedAdminEmail(data),
    }),
  ]);
}

export async function notifyReferralResponded(referralRequestId: string): Promise<void> {
  const data = await buildNotificationData(referralRequestId);
  if (!data) return;

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
    sendEmailToAdmins({
      subject: `Referral ${data.action === "ACCEPTED" ? "accepted" : "rejected"} by practitioner`,
      html: responseAdminEmail(data),
    }),
  ]);
}
