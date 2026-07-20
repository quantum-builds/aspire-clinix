import { wrapHtml } from "./referralEmailTemplates";

export interface ReportNotificationData {
  dentistName: string;
  patientName?: string;
  referringDentistName?: string;
  reportListHtml: string;
}

export function reportCreatedAdminEmail(data: ReportNotificationData): string {
  return wrapHtml(
    "New Report Created",
    `<p style="font-size:15px;line-height:1.6;">Dear Admin,</p>` +
      `<p style="font-size:15px;line-height:1.6;">A new report has been created by <strong>${data.dentistName}</strong>.</p>` +
      `<p style="font-size:15px;line-height:1.6;">${data.reportListHtml}</p>`,
  );
}

export function reportCreatedPatientEmail(
  data: ReportNotificationData,
): string {
  return wrapHtml(
    "New Report Available",
    `<p style="font-size:15px;line-height:1.6;">Dear ${data.patientName || "Patient"},</p>` +
      `<p style="font-size:15px;line-height:1.6;">A new report is available for you.</p>` +
      `<p style="font-size:15px;line-height:1.6;">${data.reportListHtml}</p>` +
      `<p style="font-size:15px;line-height:1.6;">Please log in to the Aspire Clinic portal to view your report.</p>`,
  );
}

export function reportCreatedReferringDentistEmail(
  data: ReportNotificationData,
): string {
  return wrapHtml(
    "New Report for Your Referral",
    `<p style="font-size:15px;line-height:1.6;">Dear ${data.referringDentistName || "Referring Dentist"},</p>` +
      `<p style="font-size:15px;line-height:1.6;">A new report has been created for your referral patient <strong>${data.patientName || "a patient"}</strong>.</p>` +
      `<p style="font-size:15px;line-height:1.6;">${data.reportListHtml}</p>` +
      `<p style="font-size:15px;line-height:1.6;">Please log in to the Aspire Clinic portal to view the report.</p>`,
  );
}
