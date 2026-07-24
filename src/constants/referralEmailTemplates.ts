import { AspireDarkLogo } from "@/assets";
export interface ReferralNotificationData {
  patientName: string;
  patientEmail: string;
  practitionerName?: string;
  practitionerEmail?: string;
  referringDentistName?: string;
  referringDentistEmail?: string;
  treatmentDetails?: string;
  hasAppointment: boolean;
  action?: "ACCEPTED" | "REJECTED";
  comments?: string;
}

const LOGO_URL =
  "https://aspire-media.s3.eu-west-2.amazonaws.com/uploads/aspire-clinic/images/aspire-logo.png";

export function wrapHtml(title: string, body: string): string {
  return `
    <!DOCTYPE html>
    <html>
      <head><meta charset="UTF-8"/><title>${title}</title></head>
      <body style="font-family:'Segoe UI',Arial,sans-serif;background-color:#f4f4f7;margin:0;padding:20px;color:#333;">
        <table width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width:650px;margin:auto;background:#fff;border-radius:10px;overflow:hidden;box-shadow:0 4px 12px rgba(0,0,0,0.08);">
          <tr>
            <td style="background:#B7A58D;padding:20px;text-align:center;color:#fff;">
              <img src="${LOGO_URL}" alt="Aspire Clinic" style="max-width:150px;height:auto;margin-bottom:10px;display:block;margin-left:auto;margin-right:auto;" />
              <h1 style="margin:0;font-size:22px;">${title}</h1>
            </td>
          </tr>
          <tr><td style="padding:25px;">${body}</td></tr>
          <tr>
            <td style="background:#f1f1f1;text-align:center;padding:15px;font-size:12px;color:#777;">
              <img src="${LOGO_URL}" alt="Aspire Clinic" style="max-width:80px;height:auto;opacity:0.6;margin-bottom:5px;" />
              <br/>Aspire Clinic
            </td>
          </tr>
        </table>
      </body>
    </html>`;
}

export function assignedPractitionerEmail(
  data: ReferralNotificationData,
): string {
  const msg = data.hasAppointment
    ? `An appointment has been booked for your referral for <strong>${data.patientName}</strong>. Please review the appointment details in your dashboard.`
    : `A new referral for <strong>${data.patientName}</strong> has been assigned to you. Please review the referral details and provide your response.`;
  return wrapHtml(
    "Referral Update",
    `<p style="font-size:15px;line-height:1.6;">Dear ${data.practitionerName || "Practitioner"},</p>` +
      `<p style="font-size:15px;line-height:1.6;">${msg}</p>`,
  );
}
export function bindPractitionerEmail(
  data: ReferralNotificationData,
): string {
  const msg = `A Referral request created by Referring Dentist <strong>${data.referringDentistName}</strong> for Patient <strong>${data.patientName}</strong> has been bound to your appointment. Please review the appointment details in your dashboard.`
  return wrapHtml(
    "Referral Update",
    `<p style="font-size:15px;line-height:1.6;">Dear ${data.practitionerName || "Practitioner"},</p>` +
      `<p style="font-size:15px;line-height:1.6;">${msg}</p>`,
  );
}

export function assignedReferringDentistEmail(
  data: ReferralNotificationData,
): string {
  const msg =`The referral for <strong>${data.patientName}</strong> has been assigned to Aspire Dentist ${data.practitionerName} for review.`;
  return wrapHtml(
    "Referral Progress",
    `<p style="font-size:15px;line-height:1.6;">Dear ${data.referringDentistName || "Referring Dentist"},</p>` +
      `<p style="font-size:15px;line-height:1.6;">${msg}</p>`,
  );
}

export function bindReferringDentistEmail(
  data: ReferralNotificationData,
): string {
  const msg =`The referral that you referred for <strong>${data.patientName}</strong> has been bind to Aspire Dentist ${data.practitionerName}`;
  return wrapHtml(
    "Referral Progress",
    `<p style="font-size:15px;line-height:1.6;">Dear ${data.referringDentistName || "Referring Dentist"},</p>` +
      `<p style="font-size:15px;line-height:1.6;">${msg}</p>`,
  );
}

export function assignedPatientEmail(data: ReferralNotificationData): string {
  const msg = `Your referral request, created by your referring dentist,has been assigned to Aspire Dentist ${data.practitionerName} for review.`;
  return wrapHtml(
    "Referral Update",
    `<p style="font-size:15px;line-height:1.6;">Dear ${data.patientName},</p>` +
      `<p style="font-size:15px;line-height:1.6;">${msg}</p>`,
  );
}

export function bindPatientEmail(data: ReferralNotificationData): string {
  const msg = `Your appointment has been Bind with ${data.practitionerName}. Please check your dashboard for details.`;

  return wrapHtml(
    "Referral Update",
    `<p style="font-size:15px;line-height:1.6;">Dear ${data.patientName},</p>` +
      `<p style="font-size:15px;line-height:1.6;">${msg}</p>`,
  );
}

export function responseAdminEmail(data: ReferralNotificationData): string {
  const status = data.action === "ACCEPTED" ? "accepted" : "rejected";
  const msg = data.comments
    ? `with the following comments: "${data.comments}"`
    : "You can view the details in the dashboard.";

  return wrapHtml(
    `Referral ${status}`,
    `<p style="font-size:15px;line-height:1.6;">Dear Admin,</p>` +
      `<p style="font-size:15px;line-height:1.6;">
        <strong>${data.practitionerName}</strong> has 
        <strong>${status}</strong> the referral for 
        <strong>${data.patientName}</strong>.
      </p>` +
      `<p style="font-size:15px;line-height:1.6;margin-top:20px;">
        Comments: "${data.comments || "No comments provided"}"
      </p>`,
  );
}

export function responseReferringDentistEmail(
  data: ReferralNotificationData,
): string {
  const status = data.action === "ACCEPTED" ? "accepted" : "rejected";
  return wrapHtml(
    `Referral ${status}`,
    `<p style="font-size:15px;line-height:1.6;">Dear ${data.referringDentistName || "Referring Dentist"},</p>` +
      `<p style="font-size:15px;line-height:1.6;">The practitioner has <strong>${status}</strong> your referral for <strong>${data.patientName}</strong>.</p>` +
      (data.comments
        ? `<p style="font-size:15px;line-height:1.6;">Comments: "${data.comments}"</p>`
        : ""),
  );
}

export function responsePatientEmail(data: ReferralNotificationData): string {
  const status = data.action === "ACCEPTED" ? "accepted" : "rejected";
  const msg =
    data.action === "ACCEPTED"
      ? "Your referral has been <strong>accepted</strong>. You will be contacted to schedule an appointment."
      : "Your referral has been <strong>rejected</strong>. Please contact your referring dentist for more information.";
  return wrapHtml(
    `Referral ${status}`,
    `<p style="font-size:15px;line-height:1.6;">Dear ${data.patientName},</p>` +
      `<p style="font-size:15px;line-height:1.6;">${msg}</p>`,
  );
}

export function assignedAdminEmail(data: ReferralNotificationData): string {
  return wrapHtml(
    "Referral Update",
    `<p style="font-size:15px;line-height:1.6;">Dear Admin,</p>
    <p style="font-size:15px;line-height:1.6;">
      The referral request for patient 
      <strong>${data.patientName}</strong>, referred by Referring Dentist 
      <strong>${data.referringDentistName}</strong>, has been assigned to 
      Aspire Dentist <strong>${data.practitionerName}</strong>.
    </p>`,
  );
}

export function otpEmailHtml(otp: string | null, name?: string): string {
  return wrapHtml(
    "Your Aspire Clinic OTP Code",
    `
      ${name ? `<p style="font-size:15px;line-height:1.6;">Hi ${name},</p>` : ""}

      <p style="font-size:15px;line-height:1.6;">
        Your one-time password for Aspire Clinic is:
      </p>

      <div style="
        font-size:32px;
        font-weight:700;
        letter-spacing:8px;
        text-align:center;
        margin:25px 0;
        color:#B7A58D;
      ">
        ${otp ?? ""}
      </div>

      <p style="font-size:15px;line-height:1.6;">
        This code will expire in <strong>15 minutes</strong>.
      </p>

      <p style="font-size:15px;line-height:1.6;">
        If you did not request this code, please ignore this email.
      </p>
    `,
  );
}
export function buildReferralHtml(
  referralForm: any,
  options?: {
    recipient?: "dentist" | "patient";
    isRegistered?: boolean;
    referralId?: string;
  },
) {
  const parts: string[] = [];

  const recipient = options?.recipient ?? "dentist";
  const isRegistered = options?.isRegistered ?? true;
  const referralId = options?.referralId;

  const addSection = (title: string, body: string) => {
    parts.push(`
      <h3 style="margin-bottom:8px;color:#B7A58D;font-size:18px;">
        ${title}
      </h3>
      <div style="margin-bottom:16px;font-size:15px;line-height:1.6;">
        ${body}
      </div>
    `);
  };

  const rawBase = process.env.NEXT_PUBLIC_API_BASE_URL;

  // Header
  if (recipient === "dentist") {
    parts.push(`
      <p style="font-size:15px;line-height:1.6;">
        Hi ${referralForm.referralName ?? "Dentist"},
      </p>
    `);

    if (isRegistered) {
      parts.push(`
        <p style="font-size:15px;line-height:1.6;">
          You submitted a referral for 
          <strong>${referralForm.patientName ?? "Patient"}</strong>.
        </p>

        <p style="font-size:15px;line-height:1.6;">
          Please log in to your dashboard to review the referral details 
          and track progress.
        </p>

        <p>
          <strong>Reference:</strong> ${referralId ?? "N/A"}
        </p>
      `);
    } else {
      parts.push(`
        <p style="font-size:15px;line-height:1.6;">
          You submitted a referral for 
          <strong>${referralForm.patientName ?? "Patient"}</strong>.
        </p>

        <p style="font-size:15px;line-height:1.6;">
          Please register your account using the link below to view 
          the referral progress.
        </p>

        <p>
          <a href="${rawBase}/dentist/register">
            Register Account
          </a>
        </p>
      `);
    }
  } else {
    parts.push(`
      <p style="font-size:15px;line-height:1.6;">
        Hi ${referralForm.patientName ?? "Patient"},
      </p>
    `);

    if (isRegistered) {
      parts.push(`
        <p style="font-size:15px;line-height:1.6;">
          We received a referral for you. Our team will review it and 
          get back to you with the next steps.
        </p>

        <p>
          <strong>Reference:</strong> ${referralId ?? "N/A"}
        </p>
      `);
    } else {
      parts.push(`
        <p style="font-size:15px;line-height:1.6;">
          We received a referral for you but could not find an Aspire account.
        </p>

        <p>
          Please register to Aspire to complete your profile:
        </p>

        <p>
          <a href="${rawBase}/patient/register">
            Register Account
          </a>
        </p>
      `);
    }
  }

  // Patient details
  const patientLines: string[] = [];

  if (referralForm.patientName)
    patientLines.push(`<strong>Name:</strong> ${referralForm.patientName}`);

  if (referralForm.patientEmail)
    patientLines.push(`<strong>Email:</strong> ${referralForm.patientEmail}`);

  if (referralForm.patientPhoneNumber)
    patientLines.push(
      `<strong>Phone:</strong> ${referralForm.patientPhoneNumber}`,
    );

  if (referralForm.patientDateOfBirth)
    patientLines.push(
      `<strong>Date of birth:</strong> ${referralForm.patientDateOfBirth}`,
    );

  if (referralForm.patientAddress)
    patientLines.push(
      `<strong>Address:</strong> ${referralForm.patientAddress}`,
    );

  if (patientLines.length) {
    addSection("Patient Details", patientLines.join("<br/>"));
  }

  // Referral details
  const referralLines: string[] = [];

  if (referralForm.referralName)
    referralLines.push(
      `<strong>Referrer:</strong> ${referralForm.referralName}`,
    );

  if (referralForm.referralEmail)
    referralLines.push(`<strong>Email:</strong> ${referralForm.referralEmail}`);

  if (referralForm.referralGDC)
    referralLines.push(`<strong>GDC:</strong> ${referralForm.referralGDC}`);

  if (referralForm.referralPracticeNameAddress)
    referralLines.push(
      `<strong>Practice:</strong> ${referralForm.referralPracticeNameAddress}`,
    );

  if (referralLines.length) {
    addSection("Referral Details", referralLines.join("<br/>"));
  }

  // Treatment details
  const treatmentLines: string[] = [];

  if (referralForm.treatmentDetails)
    treatmentLines.push(
      `<strong>Treatment:</strong> ${referralForm.treatmentDetails}`,
    );

  if (referralForm.prescriptionDetails)
    treatmentLines.push(
      `<strong>Prescription:</strong> ${referralForm.prescriptionDetails}`,
    );

  if (referralForm.cbctReportPdfUrl)
    treatmentLines.push(
      `<strong>CBCT Report:</strong>
       <a href="${referralForm.cbctReportPdfUrl}">
       View Document</a>`,
    );

  if (treatmentLines.length) {
    addSection("Treatment Details", treatmentLines.join("<br/>"));
  }

  if (referralForm.other) {
    addSection("Other Notes", referralForm.other);
  }

  // Use common email wrapper
  return wrapHtml("Referral Notification", parts.join(""));
}

export default buildReferralHtml;
