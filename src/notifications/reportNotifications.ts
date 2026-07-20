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

  const reportListHtml = reports
    .map(
      (r) =>
        `<li style="margin-bottom:4px;"><strong>${r.title}</strong> (${r.fileType})</li>`,
    )
    .join("");

  const data = { dentistName, patientName, referringDentistName, reportListHtml };

  await Promise.allSettled([
    sendEmailToAdmins({
      subject: `New report created by ${dentistName}`,
      html: reportCreatedAdminEmail(data),
    }),
    needsPatient &&
      patientEmail &&
      sendEmail({
        to: patientEmail,
        subject: "New report available",
        html: reportCreatedPatientEmail(data),
      }),
    needsReferringDentist &&
      referringDentistEmail &&
      sendEmail({
        to: referringDentistEmail,
        subject: `New report for your referral patient ${patientName || ""}`,
        html: reportCreatedReferringDentistEmail(data),
      }),
  ]);
}
