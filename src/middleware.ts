import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import {
  LOGIN,
  ROOT,
  PUBLIC_ROUTES,
  AUTHERIZED_ROUTES,
} from "../src/lib/route";
import { getToken } from "next-auth/jwt";

export async function middleware(request: NextRequest) {
  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  });
  const { nextUrl } = request;
  const isAuthenticated = token !== null;
  const role = token?.role || null;

  const isPublicRoute =
    PUBLIC_ROUTES.find((route) => nextUrl.pathname.startsWith(route)) ||
    nextUrl.pathname === ROOT;

  console.log("Is Public Route:", isPublicRoute);
  console.log("Is Authenticated:", isAuthenticated);
  console.log("User Role:", role);

  if (!isAuthenticated && !isPublicRoute) {
    return NextResponse.redirect(new URL(LOGIN, nextUrl));
  }

  // Authorization logic for authorized routes
  if (isAuthenticated && role) {
    const path=AUTHERIZED_ROUTES[role as keyof typeof AUTHERIZED_ROUTES]
    console.log(path)

    console.log(nextUrl.pathname)
   const isAuthorizedRoute = nextUrl.pathname.startsWith(path)
   console.log(isAuthorizedRoute)

    if (!isAuthorizedRoute) {
      return NextResponse.redirect(new URL(ROOT, nextUrl)); // Redirect to root for unauthorized access
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dentistry/:path*","/referral/:path*","/patient/:path*"], 
};
