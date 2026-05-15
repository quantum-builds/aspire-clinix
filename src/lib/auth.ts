import CredentialsProvider from "next-auth/providers/credentials";
import { AuthOptions } from "next-auth";
import prisma from "@/lib/db";
import { verifyPassword } from "@/utils/passwordUtils";
import { TokenRoles } from "@/constants/UserRoles";
import { DentistRole } from "@prisma/client";

export const authOptions: AuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
        patientId: { label: "PatientId", type: "patientId" },
        otp: { label: "Otp", type: "otp" },
        role: { label: "Role", type: "role" },
      },
      async authorize(credentials) {
        console.log(
          "[AUTH DEBUG] Authorization started with role:",
          credentials?.role,
        );

        if (!credentials?.role)
          throw new Error("Password and role are required");

        if (credentials.role === TokenRoles.PATIENT) {
          if (!credentials.patientId) {
            throw new Error("Patient Id is required");
          }
          if (!credentials.otp) {
            throw new Error("OTP is required");
          }
        } else if (
          credentials.role === TokenRoles.REFERRING_DENTIST ||
          credentials.role === TokenRoles.DENTALLY_PRACTITIONER
        ) {
          if (!credentials?.otp) {
            throw new Error("Otp is required for dentist login");
          }
          if (!credentials?.email) {
            throw new Error("Email is required for dentist login");
          }
        } else if (credentials.role === TokenRoles.ADMIN) {
          if (!credentials?.email) {
            throw new Error("Email is required");
          }
          if (!credentials?.password) {
            throw new Error("Password and role are required");
          }
        }

        const { email, password, role } = credentials;
        let user = null;

        if (role === TokenRoles.ADMIN) {
          console.log("[ADMIN LOGIN DEBUG] Finding admin with email:", email);
          user = await prisma.admin.findUnique({ where: { email } });
          if (!user) {
            console.error(
              "[ADMIN LOGIN DEBUG] No admin account found with email:",
              email,
            );
            throw new Error("No account found");
          }

          console.log("[ADMIN LOGIN DEBUG] Admin found, verifying password");
          const isValid = await verifyPassword(password, user.password);
          if (!isValid) {
            console.error("[ADMIN LOGIN DEBUG] Password verification failed");
            throw new Error("Invalid credentials");
          }

          console.log("[ADMIN LOGIN DEBUG] Admin login successful for:", email);
          return {
            id: String(user.id),
            email: user.email,
            role: TokenRoles.ADMIN,
            name: user.fullName,
            image: user.fileUrl,
          };
        }

        if (role === TokenRoles.PATIENT) {
          const { patientId, otp } = credentials;
          console.log("[PATIENT LOGIN DEBUG] Credentials received:", {
            patientId,
            otp,
            role,
          });

          let patient = null;

          try {
            console.log(
              "[PATIENT LOGIN DEBUG] Finding patient with ID:",
              patientId,
            );
            patient = await prisma.patient.findUnique({
              where: { id: patientId },
            });
            console.log("[PATIENT LOGIN DEBUG] Patient found:", {
              id: patient?.id,
              name: patient?.name,
              email: patient?.email,
              otpStored: patient?.otp,
              otpInvalidationTime: patient?.otpInvalidationTime,
            });
          } catch (error) {
            console.error(
              "[PATIENT LOGIN DEBUG] Error in getting patient:",
              error,
            );
            throw new Error(`Error in getting patient`);
          }
          if (!patient) {
            console.error(
              "[PATIENT LOGIN DEBUG] No patient account found with ID:",
              patientId,
            );
            throw new Error("No account found");
          }

          // Validate OTP
          console.log("[PATIENT LOGIN DEBUG] Validating OTP:", {
            providedOtp: otp,
            storedOtp: patient.otp,
            otpMatch: patient.otp === otp,
            otpInvalidationTime: patient.otpInvalidationTime,
            currentTime: new Date(),
            isExpired: patient.otpInvalidationTime
              ? patient.otpInvalidationTime < new Date()
              : "no time",
          });

          if (
            patient.otp !== otp ||
            !patient.otpInvalidationTime ||
            patient.otpInvalidationTime < new Date()
          ) {
            console.error("[PATIENT LOGIN DEBUG] OTP validation failed");
            throw new Error("Invalid Otp");
          }

          console.log("[PATIENT LOGIN DEBUG] Patient login successful for:", {
            dentallyId: patient.dentallyId,
            email: patient.email,
            name: patient.name,
          });

          return {
            id: String(patient.dentallyId),
            email: patient.email,
            role: TokenRoles.PATIENT,
            name: patient.name,
            image: null,
          };
        }

        if (role !== TokenRoles.ADMIN && role !== TokenRoles.PATIENT) {
          const { email, otp } = credentials;
          console.log("[DENTIST LOGIN DEBUG] Credentials received:", {
            email,
            otp,
            role,
          });

          let dentist = null;

          try {
            console.log(
              "[DENTIST LOGIN DEBUG] Finding dentist with email:",
              email,
            );
            dentist = await prisma.dentist.findUnique({ where: { email } });
            console.log("[DENTIST LOGIN DEBUG] Dentist found:", {
              id: dentist?.id,
              role: dentist?.role,
              email: dentist?.email,
            });
          } catch (error) {
            console.error(
              "[DENTIST LOGIN DEBUG] Error in getting dentist with email:",
              email,
              error,
            );
            throw new Error(`Error in getting dentist with email ${email}`);
          }
          if (!dentist) {
            console.error(
              "[DENTIST LOGIN DEBUG] No dentist account found with email:",
              email,
            );
            throw new Error("No account found");
          }

          console.log("[DENTIST LOGIN DEBUG] Validating OTP:", {
            providedOtp: otp,
            storedOtp: dentist.otp,
            otpInvalidationTime: dentist.otpInvalidationTime,
          });
          if (
            dentist.otp !== otp ||
            !dentist.otpInvalidationTime ||
            dentist.otpInvalidationTime < new Date()
          ) {
            console.error("[DENTIST LOGIN DEBUG] OTP validation failed");
            throw new Error("Invalid Otp");
          }

          const fullName = `${dentist.firstName} ${dentist.lastName}`.trim();
          console.log(
            "[DENTIST LOGIN DEBUG] Dentist login successful for:",
            fullName,
          );
          return {
            id: String(
              dentist.role === DentistRole.DENTALLY_PRACTITIONER &&
                dentist.dentallyId
                ? dentist.dentallyId
                : dentist.id,
            ),
            email: dentist.email,
            role: dentist.role,
            name: fullName,
            image: null,
          };
        }

        console.error(
          "[AUTH ERROR] Unhandled authorization scenario - all role checks failed. Role was:",
          role,
        );
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
      console.log("[AUTH JWT CALLBACK] JWT callback triggered");
      if (user) {
        console.log("[AUTH JWT CALLBACK] Adding user to token:", {
          userId: user.id,
          email: user.email,
          role: user.role,
        });
        token.id = user.id;
        token.email = user.email;
        token.role = user.role;
        token.name = user.name;
        token.picture = user.image;
      }
      return token;
    },
    async session({ session, token }) {
      console.log(
        "[AUTH SESSION CALLBACK] Session callback triggered with role:",
        token.role,
      );
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
