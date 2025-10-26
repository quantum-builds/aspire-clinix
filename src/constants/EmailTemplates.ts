import { FormData } from "@/components/ReferralForm";

export function referralAdminEmail(formData: FormData) {
  return `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="UTF-8" />
            <title>Referral Details</title>
          </head>
          <body style="font-family: 'Segoe UI', Arial, sans-serif; background-color: #f4f4f7; margin: 0; padding: 20px; color: #333;">
            <table width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width: 650px; margin: auto; background: #ffffff; border-radius: 10px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.08);">
              <tr>
                <td style="background: #2a9d8f; padding: 20px; text-align: center; color: #fff;">
                  <h1 style="margin: 0; font-size: 22px; font-weight: 600;">Referral Form Summary</h1>
                </td>
              </tr>
              <tr>
                <td style="padding: 25px;">
    
                  <h2 style="font-size: 18px; color: #264653; margin-bottom: 10px;">Patient Details</h2>
                  <table style="width: 100%; font-size: 14px; line-height: 1.6; margin-bottom: 20px;">
                    <tr><td><strong>Name:</strong></td><td>${formData.patientName}</td></tr>
                    <tr><td><strong>Date of Birth:</strong></td><td>${formData.patientDateOfBirth
    }</td></tr>
                    <tr><td><strong>Address:</strong></td><td>${formData.patientAddress}</td></tr>
                    <tr><td><strong>Mobile Number:</strong></td><td>${formData.patientPhoneNumber
    }</td></tr>
                    <tr><td><strong>Email:</strong></td><td>${formData.patientEmail}</td></tr>
                    <tr><td><strong>Medical History:</strong></td><td>${formData.medicalHistoryPdfUrl || "N/A"
    }</td></tr>
                  </table>
    
                  <h2 style="font-size: 18px; color: #264653; margin-bottom: 10px;">Referral Details</h2>
                  <table style="width: 100%; font-size: 14px; line-height: 1.6; margin-bottom: 20px;">
                    <tr><td><strong>Details:</strong></td><td>${formData.referralDetails?.length
      ? formData.referralDetails.join(", ")
      : "None"
    }</td></tr>
                    <tr><td><strong>Other:</strong></td><td>${formData.other || "N/A"
    }</td></tr>
                    <tr><td><strong>Treatment Details:</strong></td><td>${formData.treatmentDetails || "N/A"
    }</td></tr>
                  </table>
    
                  <h2 style="font-size: 18px; color: #264653; margin-bottom: 10px;">Referring Dentist</h2>
                  <table style="width: 100%; font-size: 14px; line-height: 1.6; margin-bottom: 20px;">
                    <tr><td><strong>Name:</strong></td><td>${formData.referralName
    }</td></tr>
                    <tr><td><strong>GDC Number:</strong></td><td>${formData.referralGDC
    }</td></tr>
                    <tr><td><strong>Practice Address:</strong></td><td>${formData.patientAddress
    }</td></tr>
                    <tr><td><strong>Practice Phone:</strong></td><td>${formData.referralPhoneNumber
    }</td></tr>
                    <tr><td><strong>Practice Email:</strong></td><td>${formData.referralEmail
    }</td></tr>
                  </table>
    
                  <h2 style="font-size: 18px; color: #264653; margin-bottom: 10px;">Treatment Appointment</h2>
                  <p style="font-size: 14px; line-height: 1.6; margin: 0;">
                    <strong>Attend Appointment:</strong> ${formData.attendTreatment || "Not specified"
    }
                  </p>
    
                </td>
              </tr>
              <tr>
                <td style="background: #f1f1f1; text-align: center; padding: 15px; font-size: 12px; color: #777;">
                  Aspire Clinic • Confidential Referral Information
                </td>
              </tr>
            </table>
          </body>
        </html>
        `
}

export function referralRegisteredPatientEmail(formData: FormData, baseUrl: string) {
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="UTF-8" />
        <title>Referral Notification</title>
      </head>
      <body style="font-family: 'Segoe UI', Arial, sans-serif; background-color: #f4f4f7; margin: 0; padding: 20px; color: #333;">
        <table width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width: 650px; margin: auto; background: #ffffff; border-radius: 10px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.08);">
          <tr>
            <td style="background: #2a9d8f; padding: 20px; text-align: center; color: #fff;">
              <h1 style="margin: 0; font-size: 22px;">Referral Notification</h1>
            </td>
          </tr>
          <tr>
            <td style="padding: 25px;">
              <p style="font-size: 15px; line-height: 1.6;">
                Dear ${formData.patientName},
              </p>
              <p style="font-size: 15px; line-height: 1.6;">
                We’re pleased to inform you that <strong>${formData.referralName}</strong> (<a href="mailto:${formData.referralEmail}" style="color:#2a9d8f;">${formData.referralEmail}</a>) has referred you to <strong>Aspire Clinic</strong> for further care.
              </p>
              <p style="font-size: 15px; line-height: 1.6;">
                You can log in to your Aspire account at any time to review your appointment details and updates.
              </p>
              <div style="text-align:center; margin-top:25px;">
                <a href="${baseUrl}patient/login" style="background:#2a9d8f; color:#fff; padding:10px 25px; border-radius:6px; text-decoration:none;">Go to Dashboard</a>
              </div>
            </td>
          </tr>
          <tr>
            <td style="background:#f1f1f1; text-align:center; padding:15px; font-size:12px; color:#777;">
              Aspire Clinic • Patient Referral Notification
            </td>
          </tr>
        </table>
      </body>
    </html>
  `;
}


export function referralUnRegisteredPatientEmail(formData: FormData, baseUrl: string) {
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="UTF-8" />
        <title>Referral to Aspire Clinic</title>
      </head>
      <body style="font-family: 'Segoe UI', Arial, sans-serif; background-color: #f4f4f7; margin: 0; padding: 20px; color: #333;">
        <table width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width: 650px; margin: auto; background: #ffffff; border-radius: 10px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.08);">
          <tr>
            <td style="background: #2a9d8f; padding: 20px; text-align: center; color: #fff;">
              <h1 style="margin: 0; font-size: 22px;">Referral Invitation</h1>
            </td>
          </tr>
          <tr>
            <td style="padding: 25px;">
              <p style="font-size: 15px; line-height: 1.6;">
                Dear ${formData.patientName},
              </p>
              <p style="font-size: 15px; line-height: 1.6;">
                <strong>${formData.referralName}</strong> (<a href="mailto:${formData.referralEmail}" style="color:#2a9d8f;">${formData.referralEmail}</a>) has referred you to <strong>Aspire Clinic</strong> for specialist dental care.
              </p>
              <p style="font-size: 15px; line-height: 1.6;">
                To track your appointments, treatment history, and reports, please create your Aspire account using the link below.
              </p>
              <div style="text-align:center; margin-top:25px;">
                <a href="${baseUrl}patient/register" style="background:#e76f51; color:#fff; padding:10px 25px; border-radius:6px; text-decoration:none;">Register with Aspire</a>
              </div>
            </td>
          </tr>
          <tr>
            <td style="background:#f1f1f1; text-align:center; padding:15px; font-size:12px; color:#777;">
              Aspire Clinic • Referral Invitation
            </td>
          </tr>
        </table>
      </body>
    </html>
  `;
}


export function referralRegisteredDentistEmail(formData: FormData,baseUrl:string) {
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="UTF-8" />
        <title>Referral Confirmation</title>
      </head>
      <body style="font-family:'Segoe UI',Arial,sans-serif;background-color:#f4f4f7;margin:0;padding:20px;color:#333;">
        <table width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width:650px;margin:auto;background:#ffffff;border-radius:10px;overflow:hidden;box-shadow:0 4px 12px rgba(0,0,0,0.08);">
          <tr>
            <td style="background:#2a9d8f;padding:20px;text-align:center;color:#fff;">
              <h1 style="margin:0;font-size:22px;">Referral Submitted</h1>
            </td>
          </tr>
          <tr>
            <td style="padding:25px;">
              <p style="font-size:15px;line-height:1.6;">
                Dear ${formData.referralName},
              </p>
              <p style="font-size:15px;line-height:1.6;">
                Thank you for referring <strong>${formData.patientName}</strong> (<a href="mailto:${formData.patientEmail}" style="color:#2a9d8f;">${formData.patientEmail}</a>) to <strong>Aspire Clinic</strong>.
              </p>
              <p style="font-size:15px;line-height:1.6;">
                You can log in to your dashboard anytime to monitor referral status, appointments, and updates.
              </p>
              <div style="text-align:center;margin-top:25px;">
                <a href="${baseUrl}dentist/login" style="background:#2a9d8f;color:#fff;padding:10px 25px;border-radius:6px;text-decoration:none;">Visit Dashboard</a>
              </div>
            </td>
          </tr>
          <tr>
            <td style="background:#f1f1f1;text-align:center;padding:15px;font-size:12px;color:#777;">
              Aspire Clinic • Referral Confirmation
            </td>
          </tr>
        </table>
      </body>
    </html>
  `;
}

export function referralUnregisteredDentistEmail(formData: FormData,baseUrl:string) {
  return `
  <!DOCTYPE html>
  <html>
    <head>
      <meta charset="UTF-8" />
      <title>Referral Confirmation</title>
    </head>
    <body style="font-family:'Segoe UI',Arial,sans-serif;background-color:#f4f4f7;margin:0;padding:20px;color:#333;">
      <table width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width:650px;margin:auto;background:#ffffff;border-radius:10px;overflow:hidden;box-shadow:0 4px 12px rgba(0,0,0,0.08);">
        <tr>
          <td style="background:#2a9d8f;padding:20px;text-align:center;color:#fff;">
            <h1 style="margin:0;font-size:22px;">Referral Submitted</h1>
          </td>
        </tr>
        <tr>
          <td style="padding:25px;">
            <p style="font-size:15px;line-height:1.6;">
              Dear ${formData.referralName},
            </p>
            <p style="font-size:15px;line-height:1.6;">
              You have referred <strong>${formData.patientName}</strong> (<a href="mailto:${formData.patientEmail}" style="color:#2a9d8f;">${formData.patientEmail}</a>) to <strong>Aspire Clinic</strong>.
            </p>
            <p style="font-size:15px;line-height:1.6;">
              To track your referral progress and view appointment updates, please register your account on the Aspire portal.
            </p>
            <div style="text-align:center;margin-top:25px;">
              <a href="${baseUrl}dentist/register" style="background:#e76f51;color:#fff;padding:10px 25px;border-radius:6px;text-decoration:none;">Register as Dentist</a>
            </div>
          </td>
        </tr>
        <tr>
          <td style="background:#f1f1f1;text-align:center;padding:15px;font-size:12px;color:#777;">
            Aspire Clinic • Referral Confirmation
          </td>
        </tr>
      </table>
    </body>
  </html>
  `;
}

