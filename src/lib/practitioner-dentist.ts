import prisma from "@/lib/db";
import { gettPractitionerById } from "@/dentallyHelpers/practitioners";
import { DentistRole } from "@prisma/client";

export async function findOrCreateDentistFromPractitioner(
  practitionerId: number,
): Promise<string> {
  const existingDentist = await prisma.dentist.findFirst({
    where: { dentallyId: practitionerId },
  });

  if (existingDentist) {
    return existingDentist.id;
  }

  let firstName = "";
  let lastName = "";
  let email = "";
  let gdcNo = "";

  try {
    const practitionerRes = await gettPractitionerById(String(practitionerId));
    if (!practitionerRes.isError && practitionerRes.response?.practitioner) {
      const prac = practitionerRes.response.practitioner;
      firstName = prac.user.firstName || "";
      lastName = prac.user.lastName || "";
      email = prac.user.email || "";
      gdcNo = prac.gdcNumber || "";
    }
  } catch (e) {
    console.error("Failed to fetch practitioner from Dentally:", e);
  }

  const newDentist = await prisma.dentist.create({
    data: {
      email: email || `dentist+${practitionerId}@aspire-clinic.com`,
      firstName: firstName || "Unknown",
      lastName: lastName || "",
      gdcNo: gdcNo,
      dentallyId: practitionerId,
      role: DentistRole.DENTALLY_PRACTITIONER,
      otp: undefined,
      otpInvalidationTime: undefined,
    },
  });

  return newDentist.id;
}
