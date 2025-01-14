// types/next-auth.d.ts

import { DefaultUser } from "next-auth";

// Extend the NextAuth User type
declare module "next-auth" {
  interface User extends DefaultUser {
    role: string;
  }

  interface Session {
    user: User;
  }
}
