import { getAvailability } from "@/dentallyHelpers/availability";
import {
  resolveWellnessTreatment,
  WellnessTreatmentError,
} from "@/lib/wellness-booking";
import { TAvailabilitySlot } from "@/types/common";
import { createResponse } from "@/utils/createResponse";
import {
  buildChips,
  buildRange,
  DAY_FMT,
  TIMEZONE,
  todayKeyLondon,
} from "@/utils/slotSelectionUtils";
import axios from "axios";
import { format } from "date-fns";
import { formatInTimeZone } from "date-fns-tz";
import { NextRequest, NextResponse } from "next/server";

const DAYS = 7;

type DentallyAvailabilityEntry = {
  startTime?: string | null;
  finishTime?: string | null;
  availableDuration?: number | null;
  practitionerId?: number | null;
};

function getErrorMessage(error: unknown): string {
  if (axios.isAxiosError(error)) {
    const upstreamMessage = (
      error.response?.data as { error?: { message?: string } } | undefined
    )?.error?.message;

    if (upstreamMessage) {
      return upstreamMessage;
    }
  }

  return error instanceof Error ? error.message : String(error);
}

/**
 * Bookable slots for a Dentally wellness treatment, for 7 days from `date`
 * (London). The practitioner and slot length are decided here from the
 * treatment, never taken from the request.
 */
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = req.nextUrl;
    const treatmentIdRaw = searchParams.get("treatmentId");
    const today = todayKeyLondon();
    const date = searchParams.get("date") || today;

    if (!/^\d{4}-\d{2}-\d{2}$/.test(date) || date < today) {
      return NextResponse.json(
        createResponse(false, "Date must be today or later (YYYY-MM-DD).", null),
        { status: 400 },
      );
    }

    const { treatmentId, practitionerId, duration } =
      await resolveWellnessTreatment(treatmentIdRaw);

    const range = buildRange(date);

    // Dentally rejects availability queries that start in the past.
    const now = new Date();
    const startTime =
      new Date(range.startTime) <= now ? now.toISOString() : range.startTime;

    const availabilityResponse = await getAvailability({
      practitionerId,
      startTime,
      finishTime: range.finishTime,
      duration,
    });

    if (availabilityResponse.isError) {
      return availabilityResponse.response;
    }

    const windows: TAvailabilitySlot[] = (
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

    const days = Array.from({ length: DAYS }, (_, i) => {
      const day = new Date(`${date}T12:00:00`);
      day.setDate(day.getDate() + i);
      return { date: format(day, DAY_FMT), slots: [] as ReturnType<typeof buildChips> };
    });

    for (const window of windows) {
      for (const chip of buildChips(window, duration)) {
        const dayKey = formatInTimeZone(new Date(chip.startTime), TIMEZONE, DAY_FMT);
        days.find((day) => day.date === dayKey)?.slots.push(chip);
      }
    }

    for (const day of days) {
      day.slots.sort((a, b) => a.startTime.localeCompare(b.startTime));
    }

    return NextResponse.json(
      createResponse(true, "Slots fetched successfully.", {
        treatmentId,
        duration,
        days,
      }),
      { status: 200 },
    );
  } catch (error) {
    if (error instanceof WellnessTreatmentError) {
      return NextResponse.json(
        createResponse(false, error.message, { code: error.code }),
        { status: error.status },
      );
    }

    const status =
      axios.isAxiosError(error) && error.response ? error.response.status : 500;

    return NextResponse.json(
      createResponse(false, getErrorMessage(error), null),
      { status },
    );
  }
}
