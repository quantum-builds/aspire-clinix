import { FormData } from "@/components/ReferralForm";
import { getLogoUrl } from "@/utils/getLogoUrl";

// const LOGO_URL = getLogoUrl();
const LOGO_URL = "https://aspire-media.s3.eu-west-2.amazonaws.com/uploads/aspire-clinic/images/aspire-logo.png"
// console.log("logoooooooooooooooooooooooo urllllllllllllll ", LOGO_URL)

// const BASE64 = "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"
// const LOGO_URL = `data:image/png;base64,${BASE64}`;


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
                  <p>${LOGO_URL}</p>
                  <img src="${LOGO_URL}" alt="Aspire Clinic Logo" style="max-width: 150px; height: auto; margin-bottom: 10px; display: block; margin-left: auto; margin-right: auto;" />
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
                <img src="${LOGO_URL}" alt="Aspire Clinic" style="max-width: 80px; height: auto; opacity: 0.6; margin-bottom: 5px;" />
                <br/>  
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
              <img src="${LOGO_URL}" alt="Aspire Clinic Logo" style="max-width: 150px; height: auto; margin-bottom: 10px; display: block; margin-left: auto; margin-right: auto;" />
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
              <img src="${LOGO_URL}" alt="Aspire Clinic" style="max-width: 80px; height: auto; opacity: 0.6; margin-bottom: 5px;" />
              <br/>
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
              <img src="${LOGO_URL}" alt="Aspire Clinic Logo" style="max-width: 150px; height: auto; margin-bottom: 10px; display: block; margin-left: auto; margin-right: auto;" />
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
              <img src="${LOGO_URL}" alt="Aspire Clinic" style="max-width: 80px; height: auto; opacity: 0.6; margin-bottom: 5px;" />
              <br/>
              Aspire Clinic • Referral Invitation
            </td>
          </tr>
        </table>
      </body>
    </html>
  `;
}


export function referralRegisteredDentistEmail(formData: FormData, baseUrl: string) {
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
              <img src="${LOGO_URL}" alt="Aspire Clinic Logo" style="max-width:150px;height:auto;margin-bottom:10px;display:block;margin-left:auto;margin-right:auto;" />
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
              <img src="${LOGO_URL}" alt="Aspire Clinic" style="max-width:80px;height:auto;opacity:0.6;margin-bottom:5px;" />
              <br/>
              Aspire Clinic • Referral Confirmation
            </td>
          </tr>
        </table>
      </body>
    </html>
  `;
}

export function referralUnregisteredDentistEmail(formData: FormData, baseUrl: string) {
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
            <img src="${LOGO_URL}" alt="Aspire Clinic Logo" style="max-width:150px;height:auto;margin-bottom:10px;display:block;margin-left:auto;margin-right:auto;" />
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
            <img src="${LOGO_URL}" alt="Aspire Clinic" style="max-width:80px;height:auto;opacity:0.6;margin-bottom:5px;" />
            <br/>
            Aspire Clinic • Referral Confirmation
          </td>
        </tr>
      </table>
    </body>
  </html>
  `;
}

