import CredentialsProvider from "next-auth/providers/credentials";
import { AuthOptions } from "next-auth";
import prisma from "@/lib/db";
import { verifyPassword } from "@/utils/passwordUtils";
import { UserRoles } from "@/types/common";

export const authOptions: AuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
        role: { label: "Role", type: "role" },
      },
      async authorize(credentials) {
        if (!credentials?.email) throw new Error("Email is required");
        if (!credentials?.password || !credentials?.role)
          throw new Error("Password and role are required");

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
          user = await prisma.patient.findUnique({ where: { email } });
          if (!user) throw new Error("No account found");

          const isValid = await verifyPassword(password, user.password);
          if (!isValid) throw new Error("Invalid credentials");

          return {
            id: user.id,
            email: user.email,
            role: UserRoles.PATIENT,
            name: user.fullName,
            image: user.fileUrl,
          };
        }

        if (role === UserRoles.DENTIST) {
          user = await prisma.dentist.findUnique({ where: { email } });
          if (!user) throw new Error("No account found");

          const isValid = await verifyPassword(password, user.password);
          if (!isValid) throw new Error("Invalid credentials");

          return {
            id: user.id,
            email: user.email,
            role: user.role,
            name: user.fullName,
            image: user.fileUrl,
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
