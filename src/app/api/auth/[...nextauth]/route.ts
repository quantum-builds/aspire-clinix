import NextAuth, { AuthOptions, getServerSession } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import prisma from "@/lib/db";
import { verifyPassword } from "@/utils/passwordUtils";

const authOptions: AuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
        role: { label: "Role", type: "role" },
      },
      async authorize(credentials) {
        if (
          !credentials ||
          !credentials.email ||
          !credentials.password ||
          !credentials.role
        ) {
          throw new Error("Email, password and role are required");
        }

        // const session = await getServerSession(authOptions);
        // console.log(session);
        const { email, password } = credentials;

        const user = await prisma.user.findUnique({
          where: { email },
        });

        if (!user || !user.password || user.role !== credentials.role) {
          throw new Error("Invalid email, password or role");
        }

        const isValidPassword = await verifyPassword(password, user.password);

        if (!isValidPassword) {
          throw new Error("Invalid email, password or role");
        }

        return {
          id: user.id,
          email: user.email,
          role: user.role,
        };
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.email = user.email;
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.email = token.email as string;
        session.user.role = token.role as string;
      }
      return session;
    },
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
