import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";
import { DENTALLY_ENDPOINTS } from "./config/api-config";

const secret = process.env.NEXTAUTH_SECRET; // required for getToken

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Define public routes
  const patientPublic = ["/patient/login", "/patient/otp-verify", "/patient/register"];
  const dentistPublic = ["/dentist/login", "/dentist/otp-verify", "/dentist/register"];
  const clinicPublic = ["/clinic/login", "/clinic/register", "/clinic/otp-verify"];

  // Dentist role-based route permissions
  const dentistAllowedRoutes: Record<string, string[]> = {
    DENTALLY_PRACTITIONER: [
      "/dentist/appointments",
      "/dentist/appointments/upcoming",
      "/dentist/appointments/past",
      "/dentist/referral-request",
      "/dentist/profile",
      "/dentist/referral-history",
    ],
    REFERRING_DENTIST: [
      "/dentist/appointments",
      "/dentist/referral-history",
      "/dentist/loyalty-points",
      "/dentist/profile",
    ],
  };

  // Get token
  const token = await getToken({ req: request, secret });
  // ---- 1. If no token ----
  if (!token) {
    if (
      pathname.startsWith("/patient") &&
      !patientPublic.includes(pathname)
    ) {
      const loginUrl = new URL("/patient/login", request.url);

      loginUrl.searchParams.set(
        "redirectTo",
        pathname,
      );

      return NextResponse.redirect(loginUrl);
    }

    if (
      pathname.startsWith("/dentist") &&
      !dentistPublic.includes(pathname)
    ) {
      const loginUrl = new URL("/dentist/login", request.url);

      loginUrl.searchParams.set(
        "redirectTo",
        pathname,
      );

      return NextResponse.redirect(loginUrl);
    }

    if (
      pathname.startsWith("/clinic") &&
      !clinicPublic.includes(pathname)
    ) {
      const loginUrl = new URL("/clinic/login", request.url);

      loginUrl.searchParams.set(
        "redirectTo",
        pathname,
      );

      return NextResponse.redirect(loginUrl);
    }

    return NextResponse.next();
  }

  // =========================================================
  // 2. USER IS LOGGED IN
  // =========================================================

  const role = token.role as string;

  // Already logged-in patient should not see login/register/otp pages
  if (
    patientPublic.includes(pathname) &&
    role === "PATIENT"
  ) {
    return NextResponse.redirect(
      new URL("/patient", request.url),
    );
  }

  // Already logged-in dentist should not see login/register/otp pages
  if (
    dentistPublic.includes(pathname) &&
    (role === "DENTALLY_PRACTITIONER" ||
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
    const loginUrl = new URL("/patient/login", request.url);

    loginUrl.searchParams.set(
      "redirectTo",
      pathname,
    );

    return NextResponse.redirect(loginUrl);
  }

  // Dentist routes
  if (
    pathname.startsWith("/dentist") &&
    !dentistPublic.includes(pathname) &&
    !(
      role === "DENTALLY_PRACTITIONER" ||
      role === "REFERRING_DENTIST"
    )
  ) {
    const loginUrl = new URL("/dentist/login", request.url);

    loginUrl.searchParams.set(
      "redirectTo",
      pathname,
    );

    return NextResponse.redirect(loginUrl);
  }

  // Clinic/Admin routes
  if (
    pathname.startsWith("/clinic") &&
    !clinicPublic.includes(pathname) &&
    role !== "ADMIN"
  ) {
    const loginUrl = new URL("/clinic/login", request.url);

    loginUrl.searchParams.set(
      "redirectTo",
      pathname,
    );

    return NextResponse.redirect(loginUrl);
  }

  // ---- 4. Dentist role-specific restrictions ----

  if (
    role === "REFERRING_DENTIST" &&
    pathname.startsWith(
      "/dentist/appointments/upcoming",
    )
  ) {
    return NextResponse.redirect(
      new URL(
        "/dentist/referral-history",
        request.url,
      ),
    );
  }

  if (
    pathname.startsWith("/dentist") &&
    (role === "DENTALLY_PRACTITIONER" ||
      role === "REFERRING_DENTIST")
  ) {
    const allowedRoutes =
      dentistAllowedRoutes[role] || [];

    const isAllowed = allowedRoutes.some((route) =>
      pathname.startsWith(route),
    );

    if (!isAllowed) {
      return NextResponse.redirect(
        new URL("/403", request.url),
      );
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|api/).*)",
  ],
};