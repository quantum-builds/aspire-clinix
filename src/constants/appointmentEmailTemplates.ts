import { wrapHtml } from "./referralEmailTemplates";

export interface AppointmentNotificationData {
  patientName?: string;
  referringDentistName?: string;
  status: string;
}

export function appointmentStatusAdminEmail(
  data: AppointmentNotificationData,
): string {
  return wrapHtml(
    `Appointment ${data.status}`,
    `<p style="font-size:15px;line-height:1.6;">Appointment for <strong>${data.patientName || "a patient"}</strong> has been <strong>${data.status}</strong>.</p>` +
      `<p style="font-size:15px;line-height:1.6;">Please check the dashboard for details.</p>`,
  );
}

export function appointmentStatusPatientEmail(
  data: AppointmentNotificationData,
): string {
  return wrapHtml(
    `Your appointment has been ${data.status}`,
    `<p style="font-size:15px;line-height:1.6;">Your appointment has been <strong>${data.status}</strong>.</p>` +
      `<p style="font-size:15px;line-height:1.6;">Thank you for choosing Aspire Clinic.</p>`,
  );
}

export function appointmentStatusReferringDentistEmail(
  data: AppointmentNotificationData,
): string {
  return wrapHtml(
    `Appointment for your referral patient ${data.patientName || ""} has been ${data.status}`,
    `<p style="font-size:15px;line-height:1.6;">Appointment for your referral patient <strong>${data.patientName || "a patient"}</strong> has been <strong>${data.status}</strong>.</p>` +
      `<p style="font-size:15px;line-height:1.6;">Log in to Aspire Clinic to view the details.</p>`,
  );
}
