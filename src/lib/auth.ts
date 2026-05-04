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
        if (!credentials?.role)
          throw new Error("Password and role are required");

        if (credentials.role === TokenRoles.PATIENT) {
          if (!credentials.patientId) {
            throw new Error("Patient Id is required");
          }
          if (!credentials.otp) {
            throw new Error("OTP is required");
          }
        } else if (credentials.role === TokenRoles.REFERRING_DENTIST ||
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
          user = await prisma.admin.findUnique({ where: { email } });
          if (!user) throw new Error("No account found");

          const isValid = await verifyPassword(password, user.password);
          if (!isValid) throw new Error("Invalid credentials");

          return {
            id: user.id,
            email: user.email,
            role: TokenRoles.ADMIN,
            name: user.fullName,
            image: user.fileUrl,
          };
        }

        if (role === TokenRoles.PATIENT) {
          const { patientId, otp } = credentials;

          let patient = null;

          try {
            patient = await prisma.patient.findUnique({ where: { id: patientId } });
          } catch (error) {
            throw new Error(`Error in getting patient`);
          }
          if (!patient) {
            throw new Error("No account found");
          }

          if (
            patient.otp !== otp ||
            !patient.otpInvalidationTime ||
            patient.otpInvalidationTime < new Date()
          ) {
            throw new Error("Invalid Otp");
          }

          return {
            id: patient.dentallyId,
            email: patient.email,
            role: TokenRoles.PATIENT,
            name: patient.name,
            image: null,
          };
        }

        if (role !== TokenRoles.ADMIN && role !== TokenRoles.PATIENT) {
          const { email, otp } = credentials;
          console.log("credentislas are ", credentials)

          let dentist = null;

          try {
            dentist = await prisma.dentist.findUnique({ where: { email } });
          } catch (error) {
            throw new Error(`Error in getting dentist with email ${email}`);
          }
          if (!dentist) {
            throw new Error("No account found");
          }
          console.log("dentist is ", dentist)
          if (
            dentist.otp !== otp ||
            !dentist.otpInvalidationTime ||
            dentist.otpInvalidationTime < new Date()
          ) {
            throw new Error("Invalid Otp");
          }

          const fullName = `${dentist.firstName} ${dentist.lastName}`.trim();
          return {
            id: dentist.role === DentistRole.DENTALLY_PRACTITIONER && dentist.dentallyId ? dentist.dentallyId : dentist.id,
            email: dentist.email,
            role: dentist.role,
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
