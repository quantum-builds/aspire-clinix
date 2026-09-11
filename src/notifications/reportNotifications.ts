import prisma from "@/lib/db";
import { sendEmail, sendEmailToAdmins } from "@/lib/emailService";
import {
  reportCreatedAdminEmail,
  reportCreatedPatientEmail,
  reportCreatedReferringDentistEmail,
} from "@/constants/reportEmailTemplates";

interface ReportInput {
  patientDentallyId: string;
  title: string;
  fileType: string;
  recipientType?: string | null;
}

export async function notifyReportsCreated(
  reports: ReportInput[],
  dentistId: string,
  appointmentId: string,
): Promise<void> {
  const hasRecipientType = reports.some((r) => r.recipientType);
  if (!hasRecipientType) return;

  const dentist = await prisma.dentist.findUnique({
    where: { id: dentistId },
    select: { firstName: true, lastName: true },
  });
  if (!dentist) return;

  const dentistName = `${dentist.firstName} ${dentist.lastName}`.trim();

  const needsPatient = reports.some((r) => r.recipientType === "PATIENT");
  const needsReferringDentist = reports.some(
    (r) => r.recipientType === "REFERRING_DENTIST",
  );

  let patientName: string | undefined;
  let patientEmail: string | undefined;
  let referringDentistName: string | undefined;
  let referringDentistEmail: string | undefined;

  const firstPatientDentallyId = reports[0]?.patientDentallyId;

  if ((needsPatient || needsReferringDentist) && firstPatientDentallyId) {
    const patient = await prisma.patient.findFirst({
      where: { dentallyId: Number(firstPatientDentallyId) },
      select: { name: true, email: true },
    });

    if (patient) {
      patientName = patient.name;
      patientEmail = patient.email;
    }

    if (needsReferringDentist && patient?.email) {
      const referralForm = await prisma.referralForm.findFirst({
        where: { patientEmail: patient.email },
            select: { referralEmail: true, referralName: true },
        orderBy: { createdAt: "desc" },
      });

      if (referralForm) {
        referringDentistEmail = referralForm.referralEmail;
        referringDentistName = referralForm.referralName;
      }
    }
  }
  console.log("REPORT NOTIFICATION DATA:", referringDentistEmail)

  const rawBase =
    process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3000/";

  const base = rawBase.endsWith("/") ? rawBase.slice(0, -1) : rawBase;

  const reportListHtml = reports
    .map((r) => {
      return `
      <li style="margin-bottom:4px;">
        <strong>${r.title}</strong>
        (${r.fileType})
      </li>
    `;
    })
    .join("");

  const baseData = {
    dentistName,
    patientName,
    referringDentistName,
    reportListHtml,
  };

  const adminData = {
    ...baseData,
    reportLink: `${base}/clinic/appointments/${appointmentId}/reports`,
  };
  const patientData = {
    ...baseData,
    reportLink: `${base}/patient/appointments/${appointmentId}/reports`,
  };
  const dentistData = {
    ...baseData,
    reportLink: `${base}/dentist/appointments/${appointmentId}/reports`,
  };

  await Promise.allSettled([
    sendEmailToAdmins({
      subject: `New report created by ${dentistName}`,
      html: reportCreatedAdminEmail(adminData),
    }),
    needsPatient &&
      patientEmail &&
      sendEmail({
        to: patientEmail,
        subject: "New report available",
        html: reportCreatedPatientEmail(patientData),
      }),
    needsReferringDentist &&
      referringDentistEmail &&
      sendEmail({
        to: referringDentistEmail,
        subject: `New report for your referral patient ${patientName || ""}`,
        html: reportCreatedReferringDentistEmail(dentistData),
      }),
  ]);
}
