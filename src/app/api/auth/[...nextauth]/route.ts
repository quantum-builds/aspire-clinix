import prisma from "@/lib/db";
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { verifyPassword } from "@/utils/passwordUtils";

export const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials || !credentials.email || !credentials.password) {
          throw new Error("Email and password are required");
        }
      
        const { email, password } = credentials;

        const user = await prisma.patient.findUnique({
          where: { email },
        });

        // console.log(user);
        // console.log(user?.password);
        if (!user || !user.password) {
          throw new Error("Invalid email or password");
        }

        const isValidPassword = await verifyPassword(password, user.password);

        console.log("is valid pass", isValidPassword);
        if (!isValidPassword) {
          throw new Error("Invalid email or password");
        }

        // Return user object with the fields needed in JWT and session callbacks
        return {
          id: user.id,
          email: user.email,
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
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.email = token.email;
      }
      return session;
    },
  },
  pages: {
    // signIn: "/login", // Custom sign-in page URL
    // error: "/create-account", // Custom error page URL
  },
});

export { handler as GET, handler as POST };
