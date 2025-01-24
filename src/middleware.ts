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
  console.log("Is Authenticated:", isAuthenticated);
  const role = token?.role || null;

  console.log("User Role:", role);
  const isPublicRoute =
    PUBLIC_ROUTES.find((route) => nextUrl.pathname.startsWith(route)) ||
    nextUrl.pathname === ROOT;

  console.log("Is Public Route:", isPublicRoute);

  if (!isAuthenticated && !isPublicRoute) {
    return NextResponse.redirect(new URL(LOGIN, nextUrl));
  }

  if (isAuthenticated && role) {
    const path = AUTHERIZED_ROUTES[role as keyof typeof AUTHERIZED_ROUTES];
    console.log(path);

    console.log(nextUrl.pathname);
    const isAuthorizedRoute = nextUrl.pathname.startsWith(path);
    console.log(isAuthorizedRoute);

    if (!isAuthorizedRoute) {
      return NextResponse.redirect(new URL(ROOT, nextUrl));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/patient/:path*", "/dentist/:path*", "/admin/:path*", "/login"],
};
