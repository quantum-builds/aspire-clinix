import CredentialsProvider from "next-auth/providers/credentials";
import { AuthOptions } from "next-auth";
import prisma from "@/lib/db";
import { verifyPassword } from "@/utils/passwordUtils";
import { UserRoles } from "@/types/common";
import { getPatient } from "@/dentallyHelpers/patient";
import { getPractitioners } from "@/dentallyHelpers/practitioners";
import sendgrid from "@/config/sendgrid-config";

import { generateOtp } from "@/utils/generateOtp";

export const authOptions: AuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
        gdcNumber: { label: "GdcNumber", type: "gdcNumber" },
        firstName: { label: "FirstName", type: "firstName" },
        lastName: { label: "LastName", type: "lastName" },
        mobilePhone: { label: "MobilePhone", type: "mobilePhone" },
        dateOfBirth: { label: "DateOfBirth", type: "dateOfBirth" },
        role: { label: "Role", type: "role" },
      },
      async authorize(credentials) {
        if (!credentials?.role)
          throw new Error("Password and role are required");

        if (credentials.role === UserRoles.PATIENT) {
          if (!credentials.firstName || !credentials.lastName) {
            throw new Error("FirstName and LastName is required");
          }
          if (!credentials.mobilePhone) {
            throw new Error("Mobile Phone is required");
          }
          if (!credentials.dateOfBirth) {
            throw new Error("Date Of Birth is required");
          }
        } else if (credentials.role === UserRoles.DENTIST) {
          if (!credentials?.gdcNumber) {
            throw new Error("GDC number is required for dentist login");
          }
          if (!credentials?.email) {
            throw new Error("Email is required for dentist login");
          }
        } else if (credentials.role === UserRoles.ADMIN) {
          if (!credentials?.email) {
            throw new Error("Email is required");
          }
          if (!credentials.password) {
            throw new Error("Password and role are required");
          }
        }

        const { email, password, role } = credentials;
        let user = null;

        if (role === UserRoles.ADMIN) {
          user = await prisma.admin.findUnique({ where: { email } });
          if (!user) throw new Error("No account found");

          const isValid = await verifyPassword(password, user.password);
          if (!isValid) throw new Error("Invalid credentials");

          return {
            id: user.id,
            email: user.email,
            role: UserRoles.ADMIN,
            name: user.fullName,
            image: user.fileUrl,
          };
        }

        if (role === UserRoles.PATIENT) {
          const { firstName, lastName, mobilePhone, dateOfBirth } = credentials;

          const response = await getPatient({
            firstName,
            lastName,
            mobilePhone,
            dateOfBirth,
          });
          if (response.isError) throw new Error("No account found");

          const activePatients = response.response.filter(
            (res: any) => res.active && !res.archived_reason,
          );

          if (activePatients.length === 0 || activePatients.length > 1)
            throw new Error("No account found");

          user = activePatients[0];

          return {
            id: user.id,
            email: user.email,
            role: UserRoles.PATIENT,
            name: user.fullName,
            image: user.fileUrl,
          };
        }

        if (role === UserRoles.DENTIST) {
          const { email, gdcNumber } = credentials;
          const response = await getPractitioners(email, gdcNumber);

          if (response.isError) {
            throw new Error("No account found");
          }

          const normalizedEmail = email.trim().toLowerCase();
          const normalizedGdcNumber = gdcNumber.trim().toLowerCase();

          const filteredPractitioners = (response.response ?? []).filter(
            (practitioner: any) =>
              practitioner?.user?.email?.trim?.().toLowerCase?.() ===
                normalizedEmail &&
              practitioner?.gdc_Number?.trim?.().toLowerCase?.() ===
                normalizedGdcNumber,
          );

          if (filteredPractitioners.length === 0) {
            throw new Error("No account found with these details");
          }

          if (filteredPractitioners.length > 1) {
            throw new Error(
              "Multiple accounts found. Please contact Aspire support.",
            );
          }

          const matchedPractitioner = filteredPractitioners[0];
          const firstName =
            matchedPractitioner?.user?.first_name?.trim?.() ?? "";
          const lastName = matchedPractitioner?.user?.last_name?.trim?.() ?? "";
          const fullName = `${firstName} ${lastName}`.trim() || normalizedEmail;
          const otp = generateOtp();

          const existingDentist = await prisma.dentist.findFirst({
            where: {
              email: normalizedEmail,
              gdcNo: normalizedGdcNumber,
            },
          });

          if (!existingDentist) {
            user = await prisma.dentist.create({
              data: {
                email: normalizedEmail,
                gdcNo: normalizedGdcNumber,
                otp,
                otpInvalidationTime: new Date(Date.now() + 15 * 60 * 1000),
              },
            });
          } else {
            user = await prisma.dentist.update({
              where: { id: existingDentist.id },
              data: {
                otp,
                otpInvalidationTime: new Date(Date.now() + 15 * 60 * 1000),
              },
            });
          }

          const html = `
            <div style="font-family: Arial, sans-serif; line-height: 1.5; color: #111827;">
              <p>Hi ${fullName},</p>
              <p>Your one-time password is:</p>
              <div style="font-size: 24px; font-weight: 700; letter-spacing: 4px; margin: 16px 0;">
                ${otp}
              </div>
              <p>This code expires in 15 minutes.</p>
            </div>
          `;

          if (!process.env.EMAIL_FROM) {
            throw new Error("EMAIL_FROM environment variable is not set");
          }

          await sendgrid.send({
            from: process.env.EMAIL_FROM,
            to: normalizedEmail,
            subject: "Your Aspire OTP code",
            html,
            text: undefined,
          });

          return {
            id: user.id,
            email: user.email,
            role: UserRoles.DENTIST,
            name: fullName,
            image: null,
          };
        }

        throw new Error("Invalid credentials");
      },
    }),
  ],
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60,
  },
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.role = user.role;
        token.name = user.name;
        token.picture = user.image;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.email = token.email as string;
        session.user.role = token.role as string;
        session.user.name = token.name as string;
        session.user.image = token.picture as string;
      }
      return session;
    },
  },
};
