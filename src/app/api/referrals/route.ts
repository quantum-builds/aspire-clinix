import prisma from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";
import { createResponse } from "@/utils/createResponse";
import { DentistRole, ReferralRequestStatus } from "@prisma/client";
import { getToken } from "next-auth/jwt";
import { TokenRoles } from "@/constants/UserRoles";
import { getPatient } from "@/dentallyHelpers/patient";
import sendgrid from "@/config/sendgrid-config";
import buildReferralHtml from "@/utils/referalEmailDentsit";

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

function createCorsJson(body: unknown, init: ResponseInit = {}) {
  return NextResponse.json(body, {
    headers: CORS_HEADERS,
    ...init,
  });
}

export async function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: CORS_HEADERS });
}

/**
 * @swagger
 * /api/referrals:
 *   post:
 *     summary: Create a referral form and request
 *     tags: [Referrals]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               medicalHistoryPdfUrl:
 *                 type: string
 *               referralDetails:
 *                 type: array
 *                 items:
 *                   type: string
 *               treatmentDetails:
 *                 type: string
 *               patientDateOfBirth:
 *                 type: string
 *                 format: date-time
 *               patientAddress:
 *                 type: string
 *               patientEmail:
 *                 type: string
 *               patientPhoneNumber:
 *                 type: string
 *               patientFirstName:
 *                 type: string
 *               patientLastName:
 *                 type: string
 *               other:
 *                 type: string
 *               referralPracticeNameAddress:
 *                 type: string
 *               referralEmail:
 *                 type: string
 *               referralGDC:
 *                 type: string
 *               referralPhoneNumber:
 *                 type: string
 *               referralName:
 *                 type: string
 *               attendTreatment:
 *                 type: string
 *             example:
 *               patientFirstName: John
 *               patientLastName: Doe
 *               patientEmail: john.doe@example.com
 *               patientPhoneNumber: "+44 7700 900123"
 *               patientAddress: 10 High Street, London, SW1A 1AA
 *               patientDateOfBirth: "1990-04-15T00:00:00Z"
 *               referralName: Dr Jane Smith
 *               referralEmail: jane.smith@practice.example.com
 *               referralPhoneNumber: "+44 20 7946 0999"
 *               referralGDC: "123456"
 *               referralPracticeNameAddress: "Smile Dental, 22 King Road, London"
 *               attendTreatment: "Yes"
 *               referralDetails:
 *                 - "Lower left molar pain"
 *                 - "Requires endodontic assessment"
 *               treatmentDetails: "Suspected caries on 36"
 *               medicalHistoryPdfUrl: "https://example.com/medical-history/john-doe.pdf"
 *               other: "Patient prefers morning appointments"
 *     responses:
 *       201:
 *         description: Form created successfully
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               message: "Form created successfully."
 *               data:
 *                 id: "ref_01HXYZ1234ABCDE"
 *                 patientName: "John Doe"
 *                 patientEmail: "john.doe@example.com"
 *                 referralName: "Dr Jane Smith"
 *                 referralEmail: "jane.smith@practice.example.com"
 *                 referralGDC: "123456"
 *                 referralDentistId: "dent_01HXYZ1234ABCDE"
 *       500:
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             example:
 *               status: false
 *               message: "Internal Server Error"
 *               data: null
 *   get:
 *     summary: Get referral forms for the authenticated dentist
 *     tags: [Referrals]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Referral forms fetched successfully
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               message: "Referral forms fetched successfully."
 *               data:
 *                 - id: "ref_01HXYZ1234ABCDE"
 *                   patientName: "John Doe"
 *                   referralName: "Dr Jane Smith"
 *                   referralEmail: "jane.smith@practice.example.com"
 *                   referralGDC: "123456"
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             example:
 *               status: false
 *               message: "Unauthorized"
 *               data: null
 *       403:
 *         description: Forbidden
 *         content:
 *           application/json:
 *             example:
 *               status: false
 *               message: "Forbidden"
 *               data: null
 *       404:
 *         description: Dentist doesn't have any referral form
 *         content:
 *           application/json:
 *             example:
 *               status: false
 *               message: "Dentist don't have any referrel form"
 *               data: null
 *       500:
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             example:
 *               status: false
 *               message: "Internal Server Error"
 *               data: null
 */
const CBCT_OPTIONS = new Set([
  "Single Tooth (≤5×5 cm)",
  "Quadrant (8×5 cm)",
  "Single Jaw (8×8 cm)",
  "Both Jaws (>8×8 cm)",
]);

export async function POST(req: NextRequest) {
  let isPatientRegistered = true;
  let isReferralDentistRegistered = true;

  const referralForm = await req.json();
  try {
    const patientFirstName = referralForm.patientFirstName;
    const patientLastName = referralForm.patientLastName;

    if (!patientFirstName || !patientLastName) {
      return createCorsJson(
        createResponse(false, "Patient first and last name is required", null),
        { status: 400 },
      );
    }

    const response = await getPatient({
      firstName: patientFirstName,
      lastName: patientLastName,
    });

    if (response.isError) {
      return createCorsJson(createResponse(false, "Dentally Error", null), {
        status: 400,
      });
    }

    const activePatients = (response.response.patients ?? []).filter(
      (patient: any) => patient.active && !patient.archivedReason,
    );

    const patientFullName = `${patientFirstName} ${patientLastName}`;
    referralForm.patientName = patientFullName;
    delete referralForm.patientFirstName;
    delete referralForm.patientLastName;

    if (referralForm.patientDateOfBirth) {
      const parsedDateOfBirth = new Date(referralForm.patientDateOfBirth);
      if (Number.isNaN(parsedDateOfBirth.getTime())) {
        return createCorsJson(
          createResponse(false, "Patient date of birth is invalid", null),
          { status: 400 },
        );
      }

      referralForm.patientDateOfBirth = parsedDateOfBirth;
    }

    const incomingCbct =
      typeof referralForm.cbct === "string" ? referralForm.cbct.trim() : "";
    const incomingDentalSpecialty =
      typeof referralForm.dentalSpecialty === "string"
        ? referralForm.dentalSpecialty.trim()
        : "";

    if (incomingCbct && incomingDentalSpecialty) {
      return createCorsJson(
        createResponse(
          false,
          "Please select only one option from Dental Specialty or CBCT",
          null,
        ),
        { status: 400 },
      );
    }

    if (!incomingCbct && !incomingDentalSpecialty) {
      return createCorsJson(
        createResponse(
          false,
          "Please select one referral option (Dental Specialty or CBCT)",
          null,
        ),
        { status: 400 },
      );
    }

    if (CBCT_OPTIONS.has(incomingCbct)) {
      referralForm.cbct = incomingCbct;
      referralForm.dentalSpecialty = null;
    } else {
      referralForm.dentalSpecialty = incomingDentalSpecialty;
      referralForm.cbct = null;
    }

    if (activePatients.length === 1) {
      try {
        const active = activePatients[0];
        console.log("1");
        let dbPatient = await prisma.patient.findUnique({
          where: { dentallyId: active.id },
          select: { id: true },
        });
        console.log("2");

        if (!dbPatient) {
          dbPatient = await prisma.patient.create({
            data: {
              uuid: active.uuid,
              dentallyId: active.id,
              mobileNumber: active.mobilePhone,
              email: active.emailAddress,
              name: patientFullName,
              dateOfBirth: active.dateOfBirth,
              familyId: active.familyId,
            },
            select: { id: true },
          });
        }

        referralForm.patientId = dbPatient.id;
      } catch (error) {
        console.error("Error linking referral patient record:", error);
        isPatientRegistered = false;
      }
    } else if (activePatients.length === 0) {
      isPatientRegistered = false;
    } else {
      return createCorsJson(
        createResponse(
          false,
          "Multiple accounts registered under this Patient. Contact with Aspire to resolve this issue",
          null,
        ),
        { status: 400 },
      );
    }

    const referralEmail = referralForm.referralEmail;
    console.log("3");

    const referralDentist = await prisma.dentist.findFirst({
      where: { email: referralEmail, role: DentistRole.REFERRING_DENTIST },
    });
    if (referralDentist) {
      referralForm.referralDentistId = referralDentist.id;
    } else {
      isReferralDentistRegistered = false;
    }

    const referral = await prisma.$transaction(async (tx) => {
      const newReferral = await tx.referralForm.create({
        data: referralForm,
      });
      await tx.referralRequest.create({
        data: {
          referralFormId: newReferral.id,
          requestStatus: ReferralRequestStatus.UNASSIGNED,
        },
      });
      return newReferral;
    });

    const dentsitEmail = referralForm.referralEmail;
    if (dentsitEmail && process.env.EMAIL_FROM) {
      try {
        const dentistHtml = buildReferralHtml(referralForm, {
          recipient: "dentist",
          isRegistered: isReferralDentistRegistered,
          referralId: referral.id,
        });
        await sendgrid.send({
          from: process.env.EMAIL_FROM,
          to: dentsitEmail,
          subject: "New Referral Form Submitted",
          html: dentistHtml,
          text: undefined,
        });
      } catch (err) {
        console.error("Error sending referral dentist email:", err);
      }
    }

    const patientEmail = referralForm.patientEmail;
    if (patientEmail && process.env.EMAIL_FROM) {
      try {
        const patientHtml = buildReferralHtml(referralForm, {
          recipient: "patient",
          isRegistered: isPatientRegistered,
          referralId: referral.id,
        });
        const subject = isPatientRegistered
          ? "Referral form received"
          : "Complete your Aspire registration";
        await sendgrid.send({
          from: process.env.EMAIL_FROM,
          to: patientEmail,
          subject,
          html: patientHtml,
          text: undefined,
        });
      } catch (err) {
        console.error("Error sending referral patient email:", err);
      }
    }

    return createCorsJson(
      createResponse(true, "Form created successfully.", referral),
      { status: 201 },
    );
  } catch (error) {
    console.error("Error creating referral form:", error);
    return createCorsJson(
      createResponse(false, "Unable to create referral form", null),
      { status: 500 },
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    const token = await getToken({ req });

    if (!token) {
      return createCorsJson(createResponse(false, "Unauthorized", null), {
        status: 401,
      });
    }

    if (
      token.role === TokenRoles.PATIENT ||
      token.role === TokenRoles.DENTALLY_PRACTITIONER
    ) {
      return createCorsJson(createResponse(false, "Forbidden", null), {
        status: 403,
      });
    }

    let dentistId = null;
    if (token.role === TokenRoles.REFERRING_DENTIST) {
      dentistId = token.sub;
    }

    const referralForms = await prisma.referralForm.findMany({
      where: { referralDentistId: dentistId },
    });

    if (referralForms.length === 0) {
      return createCorsJson(
        createResponse(false, "Dentist don't have any referrel form", null),
        { status: 404 },
      );
    }

    return createCorsJson(
      createResponse(
        true,
        "Referral forms fetched successfully.",
        referralForms,
      ),
      { status: 200 },
    );
  } catch (error) {
    console.error("Error fetching referral forms:", error);
    return createCorsJson(
      createResponse(false, "Unable to fetch referral forms", null),
      { status: 500 },
    );
  }
}
