import { wrapHtml } from "./referralEmailTemplates";

export interface ReportNotificationData {
  dentistName: string;
  patientName?: string;
  referringDentistName?: string;
  reportListHtml: string;
}

export function reportCreatedAdminEmail(
  data: ReportNotificationData,
): string {
  return wrapHtml(
    "New Report Created",
    `
      <p style="font-size:15px;line-height:1.6;">
        Dear Admin,
      </p>

      <p style="font-size:15px;line-height:1.6;">
        A new report has been created by 
        <strong>Dr. ${data.dentistName}</strong>.
      </p>

      <p style="font-size:15px;line-height:1.6;">
        Please review the report details below:
      </p>

      <h3 style="margin:20px 0 10px;">
        Report Details
      </h3>

      <div style="font-size:15px;line-height:1.6;">
        ${data.reportListHtml}
      </div>

      <p style="font-size:15px;line-height:1.6;">
        Please ensure the report is reviewed and any necessary follow-up actions 
        are taken accordingly.
      </p>

      <p style="font-size:15px;line-height:1.6;">
        Thank you for helping maintain accurate and up-to-date patient records.
      </p>

      <p style="font-size:15px;line-height:1.6;">
        Kind regards,<br/>
        <strong>Aspire Clinic Team</strong>
      </p>

      <p style="font-size:15px;line-height:1.6;">
        Eve Front of House — Aspire Dental Clinic<br/>
        020 8081 9958 | info@theaspireclinic.com<br/>
        29-35 Mortimer Street<br/>
        London<br/>
        W1T 3JG
      </p>
    `,
  );
}

export function reportCreatedPatientEmail(
  data: ReportNotificationData,
): string {
  return wrapHtml(
    "New Report Available",
    `
      <p style="font-size:15px;line-height:1.6;">
        Dear ${data.patientName || "Patient"},
      </p>

      <p style="font-size:15px;line-height:1.6;">
        A new report has been created ${data.dentistName}, and is now available for you to review.
      </p>

      <p style="font-size:15px;line-height:1.6;">
        Please find the report details below:
      </p>

      <h3 style="margin:20px 0 10px;">
        Report Details
      </h3>

      <div style="font-size:15px;line-height:1.6;">
        ${data.reportListHtml}
      </div>

      <p style="font-size:15px;line-height:1.6;">
        You can log in to the Aspire Clinic portal to view your report and access 
        any additional information provided by your dental care team.
      </p>

      <p style="font-size:15px;line-height:1.6;">
        If you have any questions regarding your report, please contact Aspire Clinic 
        and our team will be happy to assist you.
      </p>

      <p style="font-size:15px;line-height:1.6;">
        Kind regards,<br/>
        <strong>Aspire Clinic Team</strong>
      </p>

      <p style="font-size:15px;line-height:1.6;">
        Eve Front of House — Aspire Dental Clinic<br/>
        020 8081 9958 | info@theaspireclinic.com<br/>
        29-35 Mortimer Street<br/>
        London<br/>
        W1T 3JG
      </p>
    `,
  );
}

export function reportCreatedReferringDentistEmail(
  data: ReportNotificationData,
): string {
  return wrapHtml(
    "New Report for Your Referral",
    `
      <p style="font-size:15px;line-height:1.6;">
        Dear ${data.referringDentistName || "Referring Dentist"},
      </p>

      <p style="font-size:15px;line-height:1.6;">
        A new report has been created for your referral patient 
        <strong>${data.patientName || "a patient"} by the Aspire Clinic Dentist ${data.dentistName}</strong>.
      </p>

      <p style="font-size:15px;line-height:1.6;">
        Please find the report details below:
      </p>

      <h3 style="margin:20px 0 10px;">
        Report Details
      </h3>

      <div style="font-size:15px;line-height:1.6;">
        ${data.reportListHtml}
      </div>

      <p style="font-size:15px;line-height:1.6;">
        You can log in to the Aspire Clinic portal to review the report and access 
        any additional information related to your referred patient.
      </p>

      <p style="font-size:15px;line-height:1.6;">
        Thank you for continuing to work with Aspire Clinic to provide the best care 
        for your patients.
      </p>

      <p style="font-size:15px;line-height:1.6;">
        Kind regards,<br/>
        <strong>Aspire Clinic Team</strong>
      </p>

      <p style="font-size:15px;line-height:1.6;">
        Eve Front of House — Aspire Dental Clinic<br/>
        020 8081 9958 | info@theaspireclinic.com<br/>
        29-35 Mortimer Street<br/>
        London<br/>
        W1T 3JG
      </p>
    `,
  );
}