import { getAvailability } from "@/dentallyHelpers/availability";
import { TAvailabilitySlot } from "@/types/common";
import { createResponse } from "@/utils/createResponse";
import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";

type DentallyAvailabilityEntry = {
  startTime?: string | null;
  finishTime?: string | null;
  availableDuration?: number | null;
  practitionerId?: number | null;
};

export async function GET(req: NextRequest) {
  try {
    const token = await getToken({ req });

    if (!token) {
      return NextResponse.json(createResponse(false, "Unauthorized", null), {
        status: 401,
      });
    }

    const { searchParams } = req.nextUrl;
    const practitionerIdRaw = searchParams.get("practitionerId");
    const startTime = searchParams.get("startTime");
    const finishTime = searchParams.get("finishTime");
    const durationRaw = searchParams.get("duration");
    const practitionerId = Number(practitionerIdRaw);

    if (
      !practitionerIdRaw ||
      !Number.isInteger(practitionerId) ||
      practitionerId <= 0
    ) {
      return NextResponse.json(
        createResponse(false, "A valid practitionerId is required.", null),
        { status: 400 },
      );
    }

    if (!startTime || !finishTime) {
      return NextResponse.json(
        createResponse(false, "startTime and finishTime are required.", null),
        { status: 400 },
      );
    }

    const duration = durationRaw ? Number(durationRaw) : null;

    const availabilityResponse = await getAvailability({
      practitionerId,
      startTime,
      finishTime,
      duration:
        duration !== null && Number.isInteger(duration) && duration > 0
          ? duration
          : null,
    });

    if (availabilityResponse.isError) {
      return availabilityResponse.response;
    }

    const slots: TAvailabilitySlot[] = (
      (availabilityResponse.response.availability ||
        []) as DentallyAvailabilityEntry[]
    )
      .filter((entry) => entry.startTime && entry.finishTime)
      .map((entry) => ({
        startTime: entry.startTime as string,
        finishTime: entry.finishTime as string,
        availableDuration: entry.availableDuration ?? 0,
        practitionerId: entry.practitionerId ?? practitionerId,
      }));

    return NextResponse.json(
      createResponse(true, "Availability fetched successfully.", slots),
      { status: 200 },
    );
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    return NextResponse.json(createResponse(false, errorMessage, null), {
      status: 500,
    });
  }
}
