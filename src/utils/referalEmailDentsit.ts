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

  const wrap = (title: string, body: string) => {
    parts.push(`<h3 style="margin-bottom:6px">${title}</h3>`);
    parts.push(`<div style="margin-bottom:12px">${body}</div>`);
  };

  const rawBase = process.env.NEXT_PUBLIC_API_BASE_URL;

  // Header
  if (recipient === "dentist") {
    parts.push(`<p>Hi ${referralForm.referralName ?? "Dentist"},</p>`);
    if (isRegistered) {
      parts.push(
        `<p>You submitted a referral for ${referralForm.patientName ?? "Patient"}.</p>`,
      );
      parts.push(
        `<p>Please log in to your dashboard to review the referral details and see any progress on the referral reuqest.</p>`,
      );
      parts.push(`<p>Reference: ${referralId ?? "N/A"}</p>`);
    } else {
      parts.push(
        `<p>You submitted a referral for ${referralForm.patientName ?? "Patient"}.</p>`,
      );
      parts.push(
        `<p>Please Register your account by following the link given below so that you an see the progress on the referral request.</p>`,
      );
      parts.push(`<p><a href="${rawBase}/dentist/register">Register</a></p>`);
    }
  } else {
    // patient
    parts.push(`<p>Hi ${referralForm.patientName ?? "Patient"},</p>`);
    if (isRegistered) {
      parts.push(
        `<p>We received a referral for you. Our team will review it and get back to you with the next steps.</p>`,
      );
      parts.push(`<p>Reference: ${referralId ?? "N/A"}</p>`);
    } else {
      parts.push(
        `<p>We received a referral for you but could not find an Aspire account for this patient.</p>`,
      );
      parts.push(
        `<p>Please register to Aspire to complete your profile and view the referral details:</p>`,
      );
      parts.push(`<p><a href="${rawBase}/patient/register">Register</a></p>`);
    }
  }
  // Patient details
  const patientLines: string[] = [];
  if (referralForm.patientName)
    patientLines.push(`<strong>Name:</strong> ${referralForm.patientName}`);
  if (referralForm.patientFirstName || referralForm.patientLastName) {
    const f = `${referralForm.patientFirstName ?? ""}`.trim();
    const l = `${referralForm.patientLastName ?? ""}`.trim();
    const full = `${f} ${l}`.trim();
    if (full) patientLines.push(`<strong>Name (entered):</strong> ${full}`);
  }
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
  if (patientLines.length) wrap("Patient details", patientLines.join("<br/>"));

  // Referral practice / referrer
  const refLines: string[] = [];
  if (referralForm.referralName)
    refLines.push(`<strong>Referrer:</strong> ${referralForm.referralName}`);
  if (referralForm.referralEmail)
    refLines.push(
      `<strong>Referrer email:</strong> ${referralForm.referralEmail}`,
    );
  if (referralForm.referralPhoneNumber)
    refLines.push(
      `<strong>Referrer phone:</strong> ${referralForm.referralPhoneNumber}`,
    );
  if (referralForm.referralGDC)
    refLines.push(`<strong>Referrer GDC:</strong> ${referralForm.referralGDC}`);
  if (referralForm.referralPracticeNameAddress)
    refLines.push(
      `<strong>Practice:</strong> ${referralForm.referralPracticeNameAddress}`,
    );
  if (refLines.length) wrap("Referral details", refLines.join("<br/>"));

  // Clinical / treatment details
  const treatLines: string[] = [];
  if (
    referralForm.referralDetails &&
    Array.isArray(referralForm.referralDetails) &&
    referralForm.referralDetails.length
  ) {
    treatLines.push(
      `<strong>Referral notes:</strong><ul>${referralForm.referralDetails.map((d: any) => `<li>${String(d)}</li>`).join("")}</ul>`,
    );
  }
  if (referralForm.treatmentDetails)
    treatLines.push(
      `<strong>Treatment details:</strong> ${referralForm.treatmentDetails}`,
    );
  if (typeof referralForm.attendTreatment !== "undefined")
    treatLines.push(
      `<strong>Attend treatment:</strong> ${referralForm.attendTreatment}`,
    );
  if (referralForm.medicalHistoryPdfUrl)
    treatLines.push(
      `<strong>Medical history:</strong> <a href="${referralForm.medicalHistoryPdfUrl}">View document</a>`,
    );

  // Other
  if (referralForm.other) wrap("Other notes", referralForm.other);

  // Footer

  return `
    <div style="font-family: Arial, sans-serif; color:#111827; line-height:1.5;">
      ${parts.join("")}
    </div>
  `;
}

export default buildReferralHtml;
