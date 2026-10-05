import { createResponse } from "@/utils/createResponse";
import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(req: NextRequest) {
  try {
    const token = await getToken({ req });

    if (!token) {
      return NextResponse.json(createResponse(false, "Unauthorized", null), {
        status: 401,
      });
    }

    const dentallyId = Number(token.id);

    if (Number.isNaN(dentallyId)) {
      return NextResponse.json(
        createResponse(false, "Invalid patient session", null),
        { status: 401 },
      );
    }

    const patient = await prisma.patient.findUnique({
      where: { dentallyId },
    });

    if (!patient) {
      return NextResponse.json(
        createResponse(false, "Patient not found", null),
        { status: 404 },
      );
    }

    const membership = await prisma.patientMembership.findFirst({
      where: { patientId: patient.id },
      orderBy: { createdAt: "desc" },
      include: {
        plan: {
          select: {
            name: true,
            treatmentLimit: true,
            hyperbaricLimit: true,
            breathworkLimit: true,
            guestPassLimit: true,
          },
        },
        pendingPlan: { select: { name: true } },
      },
    });

    return NextResponse.json(
      createResponse(true, "Membership retrieved", membership),
    );
  } catch (error) {
    console.error("Get current membership error:", error);

    return NextResponse.json(
      createResponse(
        false,
        error instanceof Error ? error.message : "Failed to get membership",
        null,
      ),
      { status: 500 },
    );
  }
}
