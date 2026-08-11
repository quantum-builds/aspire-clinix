import prisma from "@/lib/db";
import { sendEmail} from "@/lib/emailService";
import {
  appointmentStatusAdminEmail,
  appointmentStatusPatientEmail,
  appointmentStatusReferringDentistEmail,
} from "@/constants/appointmentEmailTemplates";
import { useSendEmailToAdmin } from "@/services/adminEmailServices";

export async function notifyAppointmentStatus(
  appointmentId: string,
  status: string,
): Promise<void> {
  const reports = await prisma.report.findMany({
    where: { appointmentId },
    select: { recipientType: true, patientDentallyId: true },
  });
  if (reports.length === 0) return;

  const needsPatient = reports.some(
    (r) => r.recipientType === "PATIENT",
  );
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

  const data = { patientName, referringDentistName, status, };
   const { mutateAsync: sendEmailToAdmin } = useSendEmailToAdmin();

  await Promise.allSettled([
    sendEmailToAdmin({
      subject: `Appointment ${status}`,
      html: appointmentStatusAdminEmail(data),
    }),
    needsPatient &&
      patientEmail &&
      sendEmail({
        to: patientEmail,
        subject: `Your appointment has been ${status}`,
        html: appointmentStatusPatientEmail(data),
      }),
    needsReferringDentist &&
      referringDentistEmail &&
      sendEmail({
        to: referringDentistEmail,
        subject: `Appointment for your referral patient ${patientName || ""} has been ${status}`,
        html: appointmentStatusReferringDentistEmail(data),
      }),
  ]);
}
