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
  proposedTreatmentDetails?: string;
  proposedConsultationTime?: string;
}

const LOGO_URL =
  "https://aspire-media.s3.eu-west-2.amazonaws.com/uploads/aspire-clinic/images/aspire-logo.png";

/**
 * wrapHtml
 * subtitle -> small tan/orange eyebrow label above the main title (e.g. "Patient Referral")
 * title    -> large heading (e.g. "Referral Received")
 */
export function wrapHtml(
  title: string,
  body: string,
  subtitle?: string,
): string {
  return `
    <!DOCTYPE html>
    <html>
      <head><meta charset="UTF-8"/><title>${title}</title></head>
      <body style="font-family:'Segoe UI',Arial,sans-serif;background-color:#f4f4f7;margin:0;padding:20px;color:#333;">
        <table width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width:650px;margin:auto;background:#fff;border-radius:10px;overflow:hidden;box-shadow:0 4px 12px rgba(0,0,0,0.08);">
          <tr>
            <td style="background:#3D3630;padding:35px 20px;text-align:center;color:#fff;">
              <img src="${LOGO_URL}" alt="Aspire Clinic" style="max-width:150px;height:auto;margin-bottom:6px;display:block;margin-left:auto;margin-right:auto;" />
              <p style="margin:0 0 25px 0;font-size:11px;letter-spacing:2px;color:#cfc7bd;text-transform:uppercase;">
                Dentistry &nbsp;|&nbsp; Aesthetics &nbsp;|&nbsp; Wellness
              </p>
              ${
                subtitle
                  ? `<p style="margin:0 0 6px 0;font-size:14px;letter-spacing:1px;color:#C79A6B;">${subtitle}</p>`
                  : ""
              }
              <h1 style="margin:0;font-size:26px;color:#F5EFE6;">${title}</h1>
            </td>
          </tr>
          <tr><td style="padding:25px;">${body}</td></tr>
          <tr>
            <td style="background:#3D3630;text-align:center;padding:20px;font-size:12px;color:#cfc7bd;line-height:1.6;">
              Aspire Clinic, 29-35 Mortimer Street, Fitzrovia, London W1T 3JG, United Kingdom, 020 8081 9958
              <br/>
              <a href="#" style="color:#C79A6B;text-decoration:underline;">Unsubscribe</a>
              &nbsp;·&nbsp;
              <a href="#" style="color:#C79A6B;text-decoration:underline;">Manage preferences</a>
            </td>
          </tr>
        </table>
      </body>
    </html>`;
}

export function assignedPractitionerEmail(
  data: ReferralNotificationData,
): string {
  return wrapHtml(
    "Referral Assigned",
    `
      <p style="font-size:15px;line-height:1.6;">
        Dear ${data.practitionerName || "Practitioner"},
      </p>

      <p style="font-size:15px;line-height:1.6;">
        A new referral for <strong>${data.patientName}</strong> has been assigned to you.
        Please review the referral details and provide your response.
      </p>

      <p style="font-size:15px;line-height:1.6;">
        Please find the referral details below:
      </p>

      <h3 style="margin:20px 0 10px;">
        Referral Details
      </h3>

      <p style="font-size:15px;line-height:1.6;">
        <strong>Patient</strong><br/>
        ${data.patientName}
      </p>

      <p style="font-size:15px;line-height:1.6;">
        <strong>Referring Dentist</strong><br/>
         ${data.referringDentistName}
      </p>

      <p style="font-size:15px;line-height:1.6;">
        Please review the referral in your dashboard and either <strong>accept</strong> or <strong>reject</strong> 
        the request. Also add the comments, proposed treatment details, and proposed consultation time.
      </p>

      <p style="font-size:15px;line-height:1.6;">
        Thank you for helping ensure a smooth referral process.
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
export function bindPractitionerEmail(data: ReferralNotificationData): string {
  return wrapHtml(
    "Appointment Booked",
    `
      <p style="font-size:15px;line-height:1.6;">
        Dear ${data.practitionerName || "Practitioner"},
      </p>

      <p style="font-size:15px;line-height:1.6;">
        The referral created by Referring Dentist 
        <strong>${data.referringDentistName}</strong> for Patient 
        <strong>${data.patientName}</strong> has been booked with you.
        Please review the appointment details in your dashboard.
      </p>

      <p style="font-size:15px;line-height:1.6;">
        Please find the referral details below:
      </p>

      <h3 style="margin:20px 0 10px;">
        Referral Details
      </h3>

      <p style="font-size:15px;line-height:1.6;">
        <strong>Patient</strong><br/>
        ${data.patientName}
      </p>

      <p style="font-size:15px;line-height:1.6;">
        <strong>Referring Dentist</strong><br/>
         ${data.referringDentistName}
      </p>

      <p style="font-size:15px;line-height:1.6;">
        <strong>Aspire Dentist</strong><br/>
         ${data.practitionerName}
      </p>

      <p style="font-size:15px;line-height:1.6;">
        Thank you for managing this referral. Please ensure the appointment details 
        are reviewed before the scheduled visit.
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

export function assignedReferringDentistEmail(
  data: ReferralNotificationData,
): string {
  return wrapHtml(
    "Referral Assigned",
    `
      <p style="font-size:15px;line-height:1.6;">
        Dear ${data.referringDentistName || "Referring Dentist"},
      </p>

     <p style="font-size:15px;line-height:1.6;">
  The referral that was  created by you for <strong>${data.patientName}</strong> 
  has been assigned to Aspire Dentist <strong> ${data.practitionerName}</strong> 
  for review.
</p>

      <p style="font-size:15px;line-height:1.6;">
        Please find the referral details below:
      </p>

      <h3 style="margin:20px 0 10px;">
        Referral Details
      </h3>

      <p style="font-size:15px;line-height:1.6;">
        <strong>Patient</strong><br/>
        ${data.patientName}
      </p>

      <p style="font-size:15px;line-height:1.6;">
        <strong>Referring Dentist</strong><br/>
         ${data.referringDentistName}
      </p>

      <p style="font-size:15px;line-height:1.6;">
        The assigned Aspire Dentist will now review the referral and provide a response.
        You and the patient will be notified automatically once a decision has been made.
      </p>

      <p style="font-size:15px;line-height:1.6;">
        Thank you for helping ensure a smooth referral process.
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

export function bindReferringDentistEmail(
  data: ReferralNotificationData,
): string {
  return wrapHtml(
    "Appointment Booked",
    `
      <p style="font-size:15px;line-height:1.6;">
        Dear ${data.referringDentistName || "Referring Dentist"},
      </p>

      <p style="font-size:15px;line-height:1.6;">
        The referral you created for <strong>${data.patientName}</strong> has been 
        booked with Aspire Dentist <strong> ${data.practitionerName}</strong>.
        The appointment details have been confirmed.
      </p>

      <p style="font-size:15px;line-height:1.6;">
        Please find the referral details below:
      </p>

      <h3 style="margin:20px 0 10px;">
        Referral Details
      </h3>

      <p style="font-size:15px;line-height:1.6;">
        <strong>Patient</strong><br/>
        ${data.patientName}
      </p>

      <p style="font-size:15px;line-height:1.6;">
        <strong>Referring Dentist</strong><br/>
         ${data.referringDentistName}
      </p>

      <p style="font-size:15px;line-height:1.6;">
        <strong>Aspire Dentist</strong><br/>
         ${data.practitionerName}
      </p>

      <p style="font-size:15px;line-height:1.6;">
        Thank you for referring your patient to Aspire Clinic. 
        We will continue to keep you updated throughout the referral process.
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

export function assignedPatientEmail(data: ReferralNotificationData): string {
  return wrapHtml(
    "Referral Assigned",
    `
      <p style="font-size:15px;line-height:1.6;">
        Dear ${data.patientName},
      </p>

      <p style="font-size:15px;line-height:1.6;">
        Your referral request, created by your referring dentist ${data.referringDentistName}, has been assigned 
        to Aspire Dentist <strong>${data.practitionerName}</strong> for review.
      </p>

      <p style="font-size:15px;line-height:1.6;">
        Please find the referral details below:
      </p>

      <h3 style="margin:20px 0 10px;">
        Referral Details
      </h3>

      <p style="font-size:15px;line-height:1.6;">
        <strong>Patient</strong><br/>
        ${data.patientName}
      </p>

      <p style="font-size:15px;line-height:1.6;">
        <strong>Referring Dentist</strong><br/>
         ${data.referringDentistName}
      </p>

      <p style="font-size:15px;line-height:1.6;">
        The assigned Aspire Dentist will now review your referral. 
        You will be notified once a decision has been made regarding your request.
      </p>

      <p style="font-size:15px;line-height:1.6;">
        Thank you for your patience while we process your referral.
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

export function bindPatientEmail(data: ReferralNotificationData): string {
  return wrapHtml(
    "Appointment Booked",
    `
      <p style="font-size:15px;line-height:1.6;">
        Dear ${data.patientName},
      </p>

      <p style="font-size:15px;line-height:1.6;">
        Your appointment has been booked with Aspire Dentist 
        <strong>${data.practitionerName}</strong>. 
        This appointment was arranged through the referral created by your referring dentist.
        Please check your dashboard for further details.
      </p>

      <p style="font-size:15px;line-height:1.6;">
        Please find the referral details below:
      </p>

      <h3 style="margin:20px 0 10px;">
        Referral Details
      </h3>

      <p style="font-size:15px;line-height:1.6;">
        <strong>Patient</strong><br/>
        ${data.patientName}
      </p>

      <p style="font-size:15px;line-height:1.6;">
        <strong>Referring Dentist</strong><br/>
        ${data.referringDentistName}
      </p>

      <p style="font-size:15px;line-height:1.6;">
        <strong>Aspire Dentist</strong><br/>
         ${data.practitionerName}
      </p>

      <p style="font-size:15px;line-height:1.6;">
        Thank you for choosing Aspire Clinic. We look forward to seeing you at your 
        scheduled appointment.
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

export function AdminEmail(data: ReferralNotificationData): string {
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
      (data.proposedTreatmentDetails
        ? `<p style="font-size:15px;line-height:1.6;margin-top:20px;">
            <strong>Proposed Treatment:</strong><br/>
            ${data.proposedTreatmentDetails}
          </p>`
        : "") +
      (data.proposedConsultationTime
        ? `<p style="font-size:15px;line-height:1.6;">
            <strong>Proposed Consultation Time:</strong><br/>
            ${data.proposedConsultationTime}
          </p>`
        : "") +
      `<p style="font-size:15px;line-height:1.6;">
        Comments: "${data.comments || "No comments provided"}"
      </p>`,
  );
}

export function responseReferringDentistEmail(
  data: ReferralNotificationData,
): string {
  const isAccepted = data.action === "ACCEPTED";
  const status = isAccepted ? "accepted" : "rejected";

  return wrapHtml(
    `Referral ${isAccepted ? "Accepted" : "Rejected"}`,
    `
      <p style="font-size:15px;line-height:1.6;">
        Dear  <strong>${data.referringDentistName || "Referring Dentist"}</strong>,
      </p>

      ${
        isAccepted
          ? `
            <p style="font-size:15px;line-height:1.6;">
              Thank you for placing your trust in Aspire Clinic by referring your patient,
              <strong>${data.patientName}</strong>, to our care.
            </p>

            <p style="font-size:15px;line-height:1.6;">
              We are pleased to inform you that your referral has now been
              <strong>accepted</strong> by our Aspire Clinic dentist,
              <strong>${data.practitionerName}</strong>, following a clinical review.
            </p>

            <p style="font-size:15px;line-height:1.6;">
              After carefully assessing the referral, the reviewing dentist has provided the following information:
            </p>

            <h3 style="margin:20px 0 10px;">Clinical Review</h3>

            <p style="font-size:15px;line-height:1.6;">
              <strong>Proposed Treatment</strong><br/>
              ${data.proposedTreatmentDetails || "N/A"}
            </p>

            <p style="font-size:15px;line-height:1.6;">
              <strong>Proposed Consultation Time</strong><br/>
              ${data.proposedConsultationTime || "N/A"}
            </p>

            <p style="font-size:15px;line-height:1.6;">
              <strong>Dentist Comments</strong><br/>
              ${data.comments || "No additional comments provided."}
            </p>

            <p style="font-size:15px;line-height:1.6;">
              Our administration team will now coordinate the patient's appointment and complete the appointment binding process.
              You will receive another notification once the appointment has been confirmed.
            </p>

            <p style="font-size:15px;line-height:1.6;">
              We remain committed to keeping you informed throughout your patient's treatment journey.
              Following consultation and treatment, any relevant clinical updates will be shared with you to support the patient's ongoing care.
            </p>

            <p style="font-size:15px;line-height:1.6;">
              Thank you again for choosing Aspire Clinic. We sincerely appreciate your confidence and look forward to working together to provide the highest standard of patient care.
            </p>
          `
          : `
            <p style="font-size:15px;line-height:1.6;">
              Thank you for referring your patient,
              <strong>${data.patientName}</strong>, to Aspire Clinic.
            </p>

            <p style="font-size:15px;line-height:1.6;">
              Following a clinical review by
              <strong>${data.practitionerName}</strong>,
              we regret to inform you that this referral has been
              <strong>rejected</strong>.
            </p>

            <h3 style=" color: green; margin:20px 0 10px;">Clinical Review</h3>

            <p style="font-size:15px;line-height:1.6;">
              <strong>Dentist Comments</strong><br/>
              ${data.comments || "No comments provided."}
            </p>

            <p style="font-size:15px;line-height:1.6;">
              Should you require any clarification regarding this clinical decision,
              please do not hesitate to contact our team.
            </p>

            <p style="font-size:15px;line-height:1.6;">
              Thank you for your continued trust in Aspire Clinic.
            </p>
          `
      }

      <p style="font-size:15px;line-height:1.6;">
  Kind regards,<br/>
  <strong>Aspire Clinic Team</strong><br/><br/>
  Eve Front of House — Aspire Dental Clinic<br/>
  020 8081 9958 | info@theaspireclinic.com<br/>
  29-35 Mortimer Street<br/>
  London<br/>
  W1T 3JG
</p>
    `,
  );
}

export function responsePatientEmail(data: ReferralNotificationData): string {
  const isAccepted = data.action === "ACCEPTED";

  return wrapHtml(
    `Referral ${isAccepted ? "Accepted" : "Rejected"}`,
    `
      <p style="font-size:15px;line-height:1.6;">
        Dear <strong>${data.patientName}</strong>,
      </p>

      ${
        isAccepted
          ? `
            <p style="font-size:15px;line-height:1.6;">
              Thank you for choosing Aspire Clinic.
            </p>

            <p style="font-size:15px;line-height:1.6;">
              We are pleased to let you know that your referral has been
              <strong>accepted</strong> by our Aspire Clinic dentist,
              <strong>${data.practitionerName}</strong>, following a clinical review.
            </p>

            <p style="font-size:15px;line-height:1.6;">
              Following the assessment, our dentist has provided the following information regarding your proposed treatment.
            </p>

            <h3 style="margin:20px 0 10px;">Treatment Summary</h3>

            <p style="font-size:15px;line-height:1.6;">
              <strong>Proposed Treatment</strong><br/>
              ${data.proposedTreatmentDetails || "N/A"}
            </p>

            <p style="font-size:15px;line-height:1.6;">
              <strong>Proposed Consultation Time</strong><br/>
              ${data.proposedConsultationTime || "N/A"}
            </p>

            <p style="font-size:15px;line-height:1.6;">
              <strong>Dentist Comments</strong><br/>
              ${data.comments || "No additional comments provided."}
            </p>

            <p style="font-size:15px;line-height:1.6;">
              Our administration team will now arrange your appointment and will contact you shortly with the confirmed consultation date and time.
            </p>

            <p style="font-size:15px;line-height:1.6;">
              We look forward to welcoming you to Aspire Clinic and providing you with the highest quality of care throughout your treatment journey.
            </p>

            <p style="font-size:15px;line-height:1.6;">
              If you have any questions before your appointment, please do not hesitate to contact our team.
            </p>
          `
          : `
            <p style="font-size:15px;line-height:1.6;">
              Thank you for choosing Aspire Clinic.
            </p>

            <p style="font-size:15px;line-height:1.6;">
              Following a clinical assessment by our Aspire Clinic dentist,
              <strong>${data.practitionerName}</strong>, we regret to inform you that your referral has been
              <strong>rejected</strong> at this time.
            </p>

            <h3 style="margin:20px 0 10px;">Dentist Comments</h3>

            <p style="font-size:15px;line-height:1.6;">
              ${data.comments || "No comments were provided."}
            </p>

            <p style="font-size:15px;line-height:1.6;">
              If you have any questions regarding this decision, please contact your referring dentist or Aspire Clinic for further assistance.
            </p>
          `
      }

     <p style="font-size:15px;line-height:1.6;">
  Kind regards,<br/>
  <strong>Aspire Clinic Team</strong><br/><br/>
  Eve Front of House — Aspire Dental Clinic<br/>
  020 8081 9958 | info@theaspireclinic.com<br/>
  29-35 Mortimer Street<br/>
  London<br/>
  W1T 3JG
</p>
    `,
  );
}

export function responseAdminEmail(data: ReferralNotificationData): string {
  return wrapHtml(
    "Referral Response",
    `
      <p style="font-size:15px;line-height:1.6;">
        Dear Admin,
      </p>

      <p style="font-size:15px;line-height:1.6;">
        A referral has been successfully assigned to an Aspire Clinic dentist.
      </p>

      <p style="font-size:15px;line-height:1.6;">
        Please find the referral details below:
      </p>

      <h3 style="margin:20px 0 10px;">
        Referral Details
      </h3>

      <p style="font-size:15px;line-height:1.6;">
        <strong>Patient</strong><br/>
        ${data.patientName}
      </p>

      <p style="font-size:15px;line-height:1.6;">
        <strong>Referring Dentist</strong><br/>
         ${data.referringDentistName}
      </p>

      <p style="font-size:15px;line-height:1.6;">
        <strong>Assigned Aspire Dentist</strong><br/>
         ${data.practitionerName}
      </p>
       <h3 style="margin:20px 0 10px;">Treatment Summary</h3>

            <p style="font-size:15px;line-height:1.6;">
              <strong>Proposed Treatment</strong><br/>
              ${data.proposedTreatmentDetails || "N/A"}
            </p>

            <p style="font-size:15px;line-height:1.6;">
              <strong>Proposed Consultation Time</strong><br/>
              ${data.proposedConsultationTime || "N/A"}
            </p>

            <p style="font-size:15px;line-height:1.6;">
              <strong>Dentist Comments</strong><br/>
              ${data.comments || "No additional comments provided."}
            </p>

      <p style="font-size:15px;line-height:1.6;">
        The assigned dentist will now review the referral and either 
        <strong>accept</strong> or <strong>reject</strong> the request. 
        Once a decision has been made, the referring dentist, patient, and 
        administration team will be notified automatically.
      </p>

      <p style="font-size:15px;line-height:1.6;">
        Thank you for helping ensure a smooth referral process.
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

export function otpEmailHtml(otp: string | null, name?: string): string {
  return wrapHtml(
    "Your Aspire Clinic OTP Code",
    `
      ${name ? `<p style="font-size:15px;line-height:1.6;">Hi ${name},</p>` : ""}

      <p style="font-size:15px;line-height:1.6;">
        We received a request to verify your identity for your Aspire Clinic account.
        To complete the verification process, please use the one-time password (OTP) 
        provided below.
      </p>

      <p style="font-size:15px;line-height:1.6;">
        Your Aspire Clinic verification code is:
      </p>

      <div style="
        font-size:32px;
        font-weight:700;
        letter-spacing:8px;
        text-align:center;
        margin:25px 0;
        color:#3D3630;
      ">
        ${otp ?? ""}
      </div>

     

      <p style="font-size:15px;line-height:1.6;">
        This code will expire in <strong>15 minutes</strong>. Please do not share 
        this code with anyone, including Aspire Clinic staff.
      </p>

      <p style="font-size:15px;line-height:1.6;">
        If you did not request this verification code, please ignore this email. 
        Your account will remain secure.
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
  const field = (value: any) =>
    value === undefined || value === null || value === "" ? "NA" : value;

  // ---------------------------------------------------------------------
  // DENTIST RECIPIENT — "Referral Received" confirmation
  // ---------------------------------------------------------------------
  if (recipient === "dentist") {
    parts.push(`
      <p style="font-size:13px;letter-spacing:1px;color:#B7A58D;text-transform:uppercase;margin:0 0 6px 0;">
        Confirmation
      </p>
      <h2 style="margin:0 0 20px 0;font-size:20px;color:#222;">
        Thank you for your referral.
      </h2>

      <p style="font-size:15px;line-height:1.6;">
        <strong>Dear ${field(referralForm.referralName)},</strong>
      </p>

      <p style="font-size:15px;line-height:1.6;">
        Thank you so much for entrusting <strong>${field(referralForm.patientName)}</strong> to our care
        for <strong>${field(referralForm.treatmentDetails)}</strong>. We received your referral
        ${referralForm.createdAt ? `on ${referralForm.createdAt}` : ""} and wanted to write to let you know
        it is safely with us.
      </p>

      <p style="font-size:15px;line-height:1.6;">
        Your patient will be in very good hands. One of our team will be in touch with
        ${field(referralForm.patientName)} to arrange their consultation, and we will look after them
        with the same care and attention you would give them yourself.
      </p>

      <p style="font-size:15px;line-height:1.6;">
        We will keep you fully informed throughout. You can expect a written update from us after the
        initial consultation, and again at the conclusion of any treatment we undertake. Once our care
        is complete, your patient will be returned to you for ongoing maintenance and routine care,
        together with all relevant clinical notes and findings.
      </p>
    `);

    if (!isRegistered) {
      parts.push(`
        <p style="font-size:15px;line-height:1.6;">
          Please register your account using the link below to view the referral progress.
        </p>
        <p>
          <a href="${rawBase}/dentist/register" style="color:#B7A58D;">Register Account</a>
        </p>
      `);
    }

    // Patient Details
    const patientLines: string[] = [
      `Name of Patient - ${field(referralForm.patientName)}`,
      `Date of Birth - ${field(referralForm.patientDateOfBirth)}`,
      `Address - ${field(referralForm.patientAddress)}`,
      `Mobile Number - ${field(referralForm.patientPhoneNumber)}`,
      `Email Address - ${field(referralForm.patientEmail)}`,
      `Medical History - ${field(referralForm.medicalHistoryPdfUrl ? `<a href="${referralForm.medicalHistoryPdfUrl}">View Document</a>` : undefined)}`,
    ];

    let treatmentRequiredBlock = `<p style="margin:12px 0 4px 0;">Treatment Required :</p><ol style="margin:0 0 12px 22px;padding:0;">`;
    treatmentRequiredBlock += `<li>CBCT Scan - ${field(referralForm.cbctReportPdfUrl ? `<a href="${referralForm.cbctReportPdfUrl}">View Document</a>` : undefined)}</li>`;
    treatmentRequiredBlock += `<li>Dental Speciality - ${field(referralForm.dentalSpeciality)}</li>`;
    treatmentRequiredBlock += `</ol>`;

    addSection(
      "Patient Details",
      patientLines.join("<br/>") +
        treatmentRequiredBlock +
        `<p style="margin:0 0 4px 0;">Please describe the treatment required in as much detail as possible - ${field(referralForm.treatmentDetails)}</p>` +
        `<p style="margin:0;">Supporting Documents (Photographs, Radiographs) - ${field(
          referralForm.supportingDocumentsUrl
            ? `<a href="${referralForm.supportingDocumentsUrl}">View Document</a>`
            : undefined,
        )}</p>`,
    );

    // Referring Dentist / Practice Details
    const dentistLines: string[] = [
      `Name of Dentist - ${field(referralForm.referralName)}`,
      `GDC Number - ${field(referralForm.referralGDC)}`,
      `Dentist Email - ${field(referralForm.referralEmail)}`,
      `Practice Name - ${field(referralForm.practiceName)}`,
      `Practice Email Address - ${field(referralForm.practiceEmail)}`,
      `Practice Phone Number - ${field(referralForm.practicePhoneNumber)}`,
      `Practice Address - ${field(referralForm.referralPracticeNameAddress)}`,
      `Would you like to attend the treatment appointment with the patient and shadow the dentist? - ${field(
        referralForm.attendTreatment,
      )}`,
    ];

    addSection(
      "Referring Dentist / Practice Details",
      dentistLines.join("<br/>"),
    );

    if (referralForm.prescriptionDetails) {
      addSection("Prescription Details", `${referralForm.prescriptionDetails}`);
    }

    if (referralForm.other) {
      addSection("Other Notes", referralForm.other);
    }

    // Closing / signature
    parts.push(`
      <p style="font-size:15px;line-height:1.6;margin-top:10px;">
        If at any point you would like an update, have a question, or simply want to discuss anything
        about your patient, please do not hesitate to contact me directly — I am always happy to help.
      </p>

      <p style="font-size:15px;line-height:1.6;">
        Also you can create an account with Aspire Clinic team using the link here:<br/>
        <a href="${rawBase}/patient/register" style="color:#B7A58D;">${rawBase}/patient/register</a>
      </p>

      <p style="font-size:15px;line-height:1.6;">
        Thank you again for thinking of Aspire, and we are very grateful for the trust you have placed
        in our team.
      </p>

      <p style="font-size:15px;line-height:1.6;margin-bottom:0;">With warm regards,</p>
      <p style="font-size:15px;line-height:1.6;margin-top:4px;">
        <strong>Eve</strong><br/>
        Front of House — Aspire Dental Clinic<br/>
        020 8081 9958 | <a href="mailto:info@theaspireclinic.com" style="color:#B7A58D;">info@theaspireclinic.com</a><br/>
        29-35 Mortimer Street<br/>
        London<br/>
        W1T 3JG
      </p>

      <div style="margin-top:25px;padding:20px;background:#EDE8E1;border-radius:8px;">
        <p style="margin:0 0 8px 0;font-size:13px;letter-spacing:1px;color:#B7A58D;text-transform:uppercase;">
          Taught by Those Who Teach
        </p>
        <p style="margin:0;font-size:14px;line-height:1.6;color:#444;">
          Aspire Clinic is the clinical home of the Aspire Dental Academy. Every specialist on our team
          is also an educator — holding our standards to the level we teach.
        </p>
      </div>
    `);

    return wrapHtml("Referral Received", parts.join(""), "Patient Referral");
  }

  // ---------------------------------------------------------------------
  // PATIENT RECIPIENT — unchanged
  // ---------------------------------------------------------------------
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

export function referralCreatedAdminEmail(
  form: any,
  referralLink: string,
): string {
  return wrapHtml(
    "New Referral Submitted",
    `
      <p style="font-size:15px;line-height:1.6;">
        Dear Admin,
      </p>

      <p style="font-size:15px;line-height:1.6;">
        A new referral has been submitted for
        <strong>${form.patientName}</strong> by
        <strong> ${form.referralName}</strong>.
      </p>

      <p style="font-size:15px;line-height:1.6;">
        Please review the referral details below.
      </p>

      <h3 style="margin:20px 0 10px;color:#B7A58D;">
        Patient Details
      </h3>

      <table style="width:100%;font-size:15px;line-height:1.8;">
        <tr>
          <td style="padding:4px 8px;width:170px;"><strong>Name</strong></td>
          <td>${form.patientName}</td>
        </tr>
        <tr>
          <td style="padding:4px 8px;"><strong>Date of Birth</strong></td>
          <td>${form.patientDateOfBirth ? new Date(form.patientDateOfBirth).toLocaleDateString() : "N/A"}</td>
        </tr>
        <tr>
          <td style="padding:4px 8px;"><strong>Address</strong></td>
          <td>${form.patientAddress || "N/A"}</td>
        </tr>
        <tr>
          <td style="padding:4px 8px;"><strong>Phone Number</strong></td>
          <td>${form.patientPhoneNumber || "N/A"}</td>
        </tr>
        <tr>
          <td style="padding:4px 8px;"><strong>Email</strong></td>
          <td>${form.patientEmail || "N/A"}</td>
        </tr>
        <tr>
          <td style="padding:4px 8px;"><strong>Medical History</strong></td>
          <td>
            ${
              form.medicalHistoryPdfUrl
                ? `<a href="${referralLink}">View PDF</a>`
                : "Not Provided"
            }
          </td>
        </tr>
      </table>

      <h3 style="margin:20px 0 10px;color:#B7A58D;">
        Referral Details
      </h3>

      <table style="width:100%;font-size:15px;line-height:1.8;">
        <tr>
          <td style="padding:4px 8px;width:170px;"><strong>Referral Type</strong></td>
          <td>${form.cbct || form.dentalSpecialty || "N/A"}</td>
        </tr>
        <tr>
          <td style="padding:4px 8px;"><strong>Other Details</strong></td>
          <td>${form.other || "N/A"}</td>
        </tr>
        <tr>
          <td style="padding:4px 8px;"><strong>Treatment Details</strong></td>
          <td>${form.treatmentDetails || "N/A"}</td>
        </tr>
        <tr>
          <td style="padding:4px 8px;"><strong>Prescription Details</strong></td>
          <td>${form.prescriptionDetails || "N/A"}</td>
        </tr>
        ${
          form.cbctReportPdfUrl
            ? `
        <tr>
          <td style="padding:4px 8px;"><strong>CBCT Report</strong></td>
          <td><a href="${referralLink}">View PDF</a></td>
        </tr>`
            : ""
        }
      </table>

      <h3 style="margin:20px 0 10px;color:#B7A58D;">
        Referring Dentist Details
      </h3>

      <table style="width:100%;font-size:15px;line-height:1.8;">
        <tr>
          <td style="padding:4px 8px;width:170px;"><strong>Name</strong></td>
          <td> ${form.referralName}</td>
        </tr>
        <tr>
          <td style="padding:4px 8px;"><strong>GDC Number</strong></td>
          <td>${form.referralGDC || "N/A"}</td>
        </tr>
        <tr>
          <td style="padding:4px 8px;"><strong>Practice</strong></td>
          <td>${form.referralPracticeNameAddress || "N/A"}</td>
        </tr>
        <tr>
          <td style="padding:4px 8px;"><strong>Phone Number</strong></td>
          <td>${form.referralPhoneNumber || "N/A"}</td>
        </tr>
        <tr>
          <td style="padding:4px 8px;"><strong>Email</strong></td>
          <td>${form.referralEmail || "N/A"}</td>
        </tr>
      </table>

      <h3 style="margin:20px 0 10px;">
        Treatment Appointment
      </h3>

      <p style="font-size:15px;line-height:1.6;">
        <strong>Attendance Preference:</strong>
        ${form.attendTreatment || "Not specified"}
      </p>

      <p style="font-size:15px;line-height:1.6;">
        Please review this referral in the Aspire Clinic dashboard and assign it to the appropriate Aspire Dentist for further assessment.
      </p>

      <p style="font-size:15px;line-height:1.6;">
        Thank you for helping ensure a smooth referral process.
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
    "Patient Referral",
  );
}
export default buildReferralHtml;
