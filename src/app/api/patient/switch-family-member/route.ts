import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import { TokenRoles } from "@/constants/UserRoles";
import prisma from "@/lib/db";
import { encode } from "next-auth/jwt";

export async function POST(req: NextRequest) {
  try {
    const token = await getToken({ req });
    if (!token) {
      return NextResponse.json(
        { status: false, message: "Unauthorized", data: null },
        { status: 401 },
      );
    }
    if (token.role !== TokenRoles.PATIENT) {
      return NextResponse.json(
        { status: false, message: "Forbidden", data: null },
        { status: 403 },
      );
    }

    const currentPatientDentallyId = token.sub;
    if (!currentPatientDentallyId) {
      return NextResponse.json(
        { status: false, message: "Invalid token", data: null },
        { status: 400 },
      );
    }

    const body = await req.json();
    const { targetDentallyId } = body;
    if (!targetDentallyId) {
      return NextResponse.json(
        { status: false, message: "targetDentallyId is required", data: null },
        { status: 400 },
      );
    }

    const currentPatient = await prisma.patient.findUnique({
      where: { dentallyId: Number(currentPatientDentallyId) },
    });
    if (!currentPatient || !currentPatient.familyId) {
      return NextResponse.json(
        { status: false, message: "Current patient has no family", data: null },
        { status: 400 },
      );
    }

    const targetPatient = await prisma.patient.findUnique({
      where: { dentallyId: Number(targetDentallyId) },
    });
    if (!targetPatient) {
      return NextResponse.json(
        { status: false, message: "Target patient not found", data: null },
        { status: 404 },
      );
    }

    if (targetPatient.familyId !== currentPatient.familyId) {
      return NextResponse.json(
        { status: false, message: "Target patient is not in the same family", data: null },
        { status: 403 },
      );
    }

    const now = Math.floor(Date.now() / 1000);
    const newToken = await encode({
      token: {
        id: String(targetPatient.dentallyId),
        email: targetPatient.email,
        name: targetPatient.name,
        role: TokenRoles.PATIENT,
        picture: null,
        sub: String(targetPatient.dentallyId),
        iat: now,
        exp: now + 30 * 24 * 60 * 60,
      },
      secret: process.env.NEXTAUTH_SECRET!,
    });

    const isSecure = req.url?.startsWith("https");
    const cookieName = isSecure
      ? "__Secure-next-auth.session-token"
      : "next-auth.session-token";

    const response = NextResponse.json(
      { status: true, message: "Switched successfully", data: null },
      { status: 200 },
    );

    response.cookies.set(cookieName, newToken, {
      httpOnly: true,
      secure: isSecure,
      sameSite: "lax",
      path: "/",
      maxAge: 30 * 24 * 60 * 60,
    });

    return response;
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    return NextResponse.json(
      { status: false, message: errorMessage, data: null },
      { status: 500 },
    );
  }
}
