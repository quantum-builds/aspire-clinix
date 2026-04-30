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
        otp: { label: "Otp", type: "otp" },
        firstName: { label: "FirstName", type: "firstName" },
        lastName: { label: "LastName", type: "lastName" },
        mobilePhone: { label: "MobilePhone", type: "mobilePhone" },
        dateOfBirth: { label: "DateOfBirth", type: "dateOfBirth" },
        role: { label: "Role", type: "role" },
      },
      async authorize(credentials) {
        if (!credentials?.role)
          throw new Error("Password and role are required");

        if (credentials.role === TokenRoles.PATIENT) {
          if (!credentials.firstName || !credentials.lastName) {
            throw new Error("FirstName and LastName is required");
          }
          if (!credentials.mobilePhone) {
            throw new Error("Mobile Phone is required");
          }
          if (!credentials.dateOfBirth) {
            throw new Error("Date Of Birth is required");
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
          if (!credentials.password) {
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
          const { email, firstName, lastName, otp } = credentials;

          let patient = null;
          const fullName = `${firstName} ${lastName}`.trim()

          try {
            patient = await prisma.patient.findUnique({ where: { email, name: fullName } });
          } catch (error) {
            throw new Error(`Error in getting patient with email ${email} and name ${fullName}`);
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
            name: fullName,
            image: null,
          };
        }

        if (role !== TokenRoles.ADMIN && role !== TokenRoles.PATIENT) {
          const { email, otp } = credentials;

          let dentist = null;
          const dbRole = role === TokenRoles.DENTALLY_PRACTITIONER ? DentistRole.DENTALLY_PRACTITIONER : DentistRole.REFERRING_DENTIST

          try {
            dentist = await prisma.dentist.findUnique({ where: { email, role: dbRole } });
          } catch (error) {
            throw new Error(`Error in getting dentist with email ${email}`);
          }
          if (!dentist) {
            throw new Error("No account found");
          }

          if (
            dentist.otp !== otp ||
            !dentist.otpInvalidationTime ||
            dentist.otpInvalidationTime < new Date()
          ) {
            throw new Error("Invalid Otp");
          }

          const fullName = `${dentist.firstName} ${dentist.lastName}`.trim();
          return {
            id: role === DentistRole.DENTALLY_PRACTITIONER && dentist.dentallyId ? dentist.dentallyId : dentist.id,
            email: dentist.email,
            role: dbRole,
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
