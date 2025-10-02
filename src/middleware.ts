import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

const secret = process.env.NEXTAUTH_SECRET; // required for getToken

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Define public routes
  const patientPublic = ["/patient/login", "/patient/register"];
  const dentistPublic = ["/dentist/login", "/dentist/register"];
  const clinicPublic = ["/clinic/login", "/clinic/register"];

  // Dentist role-based route permissions
  const dentistAllowedRoutes: Record<string, string[]> = {
    DENTIST: [
      "/dentist/appointments",
      "/dentist/appointments/upcoming",
      "/dentist/appointments/past",
      "/dentist/referral-request",
      "/dentist/referral-history",
      "/dentist/loyalty-points",
      "/dentist/profile",
    ],
    RECIEVING_DENTIST: [
      "/dentist/appointments",
      "/dentist/appointments/upcoming",
      "/dentist/appointments/past",
      "/dentist/referral-request",
      "/dentist/profile",
    ],
    REFERRING_DENTIST: [
      "/dentist/appointments/past",
      "/dentist/referral-history",
      "/dentist/loyalty-points",
      "/dentist/profile",
    ],
  };

  // Get token
  const token = await getToken({ req: request, secret });

  // ---- 1. If no token ----
  if (!token) {
    if (pathname.startsWith("/patient") && !patientPublic.includes(pathname)) {
      return NextResponse.redirect(new URL("/patient/login", request.url));
    }
    if (pathname.startsWith("/dentist") && !dentistPublic.includes(pathname)) {
      return NextResponse.redirect(new URL("/dentist/login", request.url));
    }
    if (pathname.startsWith("/clinic") && !clinicPublic.includes(pathname)) {
      return NextResponse.redirect(new URL("/clinic/login", request.url));
    }

    return NextResponse.next(); // public route, let them pass
  }

  // ---- 2. If token exists ----
  const role = token.role as string;

  // Redirect logged-in users away from login pages
  if (patientPublic.includes(pathname) && role === "PATIENT") {
    return NextResponse.redirect(new URL("/patient", request.url));
  }
  if (
    dentistPublic.includes(pathname) &&
    (role === "DENTIST" ||
      role === "RECIEVING_DENTIST" ||
      role === "REFERRING_DENTIST")
  ) {
    return NextResponse.redirect(new URL("/dentist", request.url));
  }
  if (clinicPublic.includes(pathname) && role === "ADMIN") {
    return NextResponse.redirect(new URL("/clinic", request.url));
  }

  // ---- 3. Protect role-based paths ----
  if (
    pathname.startsWith("/patient") &&
    !patientPublic.includes(pathname) &&
    role !== "PATIENT"
  ) {
    return NextResponse.redirect(new URL("/patient/login", request.url));
  }

  if (
    pathname.startsWith("/dentist") &&
    !dentistPublic.includes(pathname) &&
    !(
      role === "DENTIST" ||
      role === "RECIEVING_DENTIST" ||
      role === "REFERRING_DENTIST"
    )
  ) {
    return NextResponse.redirect(new URL("/dentist/login", request.url));
  }

  if (
    pathname.startsWith("/clinic") &&
    !clinicPublic.includes(pathname) &&
    role !== "ADMIN"
  ) {
    return NextResponse.redirect(new URL("/clinic/login", request.url));
  }

  // ---- 4. Dentist role-specific restrictions ----
  if (
    pathname.startsWith("/dentist") &&
    (role === "DENTIST" ||
      role === "RECIEVING_DENTIST" ||
      role === "REFERRING_DENTIST")
  ) {
    const allowedRoutes = dentistAllowedRoutes[role] || [];

    const isAllowed = allowedRoutes.some((route) => pathname.startsWith(route));

    if (!isAllowed) {
      return NextResponse.redirect(new URL("/403", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|api/).*)"],
};
