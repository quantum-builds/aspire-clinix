import { wrapHtml } from "./referralEmailTemplates";

export interface AppointmentNotificationData {
  patientName?: string;
  referringDentistName?: string;
  status: string;
  dentistName?: string;
}


export function appointmentStatusAdminEmail(
  data: AppointmentNotificationData,
): string {
  return wrapHtml(
    `Appointment ${data.status}`,
    `
      <p style="font-size:15px;line-height:1.6;">
        Dear Admin,
      </p>

      <p style="font-size:15px;line-height:1.6;">
        The appointment for <strong>${data.patientName || "a patient"}</strong> 
        has been <strong>${data.status} by the Aspire Clinic dentist ${data.dentistName} </strong>.
      </p>

      <p style="font-size:15px;line-height:1.6;">
        Please find the appointment details below:
      </p>

      <h3 style="margin:20px 0 10px;">
        Appointment Details
      </h3>

      <p style="font-size:15px;line-height:1.6;">
        <strong>Patient</strong><br/>
        ${data.patientName || "N/A"}
      </p>

      <p style="font-size:15px;line-height:1.6;">
        <strong>Status</strong><br/>
        ${data.status}
      </p>

      

      <p style="font-size:15px;line-height:1.6;">
        Please review the appointment details in the Aspire Clinic dashboard 
        and take any necessary actions.
      </p>

      <p style="font-size:15px;line-height:1.6;">
        Thank you for helping ensure a smooth appointment management process.
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

export function appointmentStatusPatientEmail(
  data: AppointmentNotificationData,
): string {
  return wrapHtml(
    `Your appointment has been ${data.status}`,
    `
      <p style="font-size:15px;line-height:1.6;">
        Dear ${data.patientName || "Patient"},
      </p>

      <p style="font-size:15px;line-height:1.6;">
        Your appointment has been <strong>${data.status}</strong>.
      </p>

      <p style="font-size:15px;line-height:1.6;">
        Please find your appointment details below:
      </p>

      <h3 style="margin:20px 0 10px;">
        Appointment Details
      </h3>

      <p style="font-size:15px;line-height:1.6;">
        <strong>Patient</strong><br/>
        ${data.patientName || "N/A"}
      </p>

      
      <p style="font-size:15px;line-height:1.6;">
        <strong>Status</strong><br/>
        ${data.status}
      </p>

      <p style="font-size:15px;line-height:1.6;">
        Please check your Aspire Clinic portal for further appointment information 
        and any additional updates.
      </p>

      <p style="font-size:15px;line-height:1.6;">
        Thank you for choosing Aspire Clinic. We look forward to providing you 
        with the best possible care.
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

export function appointmentStatusReferringDentistEmail(
  data: AppointmentNotificationData,
): string {
  return wrapHtml(
    `Appointment for your referral patient ${data.patientName || ""} has been ${data.status}`,
    `
      <p style="font-size:15px;line-height:1.6;">
        Dear Referring Dentist,
      </p>

      <p style="font-size:15px;line-height:1.6;">
        The appointment for your referral patient 
        <strong>${data.patientName || "a patient"}</strong> has been 
        <strong>${data.status}</strong>.
      </p>

      <p style="font-size:15px;line-height:1.6;">
        Please find the appointment details below:
      </p>

      <h3 style="margin:20px 0 10px;">
        Appointment Details
      </h3>

      <p style="font-size:15px;line-height:1.6;">
        <strong>Patient</strong><br/>
        ${data.patientName || "N/A"}
      </p>

      <p style="font-size:15px;line-height:1.6;">
        <strong>Status</strong><br/>
        ${data.status}
      </p>

      <p style="font-size:15px;line-height:1.6;">
        You can log in to the Aspire Clinic portal to view the appointment details 
        and any further updates related to your referral patient.
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
