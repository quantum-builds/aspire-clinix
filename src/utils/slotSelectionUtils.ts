import { TAvailabilitySlot } from "@/types/common";
import { addMinutes, format, isAfter } from "date-fns";
import { formatInTimeZone, fromZonedTime } from "date-fns-tz";

export const STORAGE_KEY = "selectedTreatmentSlot";
export const TIMEZONE = "Europe/London";
export const DAY_FMT = "yyyy-MM-dd";

export type StoredSlot = {
 
  startTime: string;
  finishTime: string;
  practitionerId: string;
  treatmentId?: string;

};

export type SlotChip = {
  key: string;
  label: string;
  startTime: string;
  finishTime: string;
};

export function toApiTime(date: Date): string {
  return formatInTimeZone(date, TIMEZONE, "yyyy-MM-dd'T'HH:mm:ssXXX");
}

export function todayKeyLondon(): string {
  return formatInTimeZone(new Date(), TIMEZONE, DAY_FMT);
}

export function keyToLocalDate(dayKey: string): Date {
  const [y, m, d] = dayKey.split("-").map(Number);
  return new Date(y, m - 1, d, 12, 0, 0);
}

export function dayLabel(
  dayKey: string,
  pattern = "EEEE d MMMM yyyy",
): string {
  return format(keyToLocalDate(dayKey), pattern);
}

export function londonDayStart(dayKey: string): Date {
  return fromZonedTime(`${dayKey}T00:00:00`, TIMEZONE);
}

export function londonDayEnd(dayKey: string): Date {
  return fromZonedTime(`${dayKey}T23:59:59`, TIMEZONE);
}

export function buildRange(startKey: string): {
  startTime: string;
  finishTime: string;
} {
  const start = londonDayStart(startKey);

  const finishDate = new Date(start);
  finishDate.setDate(finishDate.getDate() + 6);

  const finishKey = format(finishDate, DAY_FMT);

  const finish = londonDayEnd(finishKey);

  return {
    startTime: toApiTime(start),
    finishTime: toApiTime(finish),
  };
}

export function groupByDate(
  slots: TAvailabilitySlot[],
): Array<[string, TAvailabilitySlot[]]> {
  const map = new Map<string, TAvailabilitySlot[]>();

  for (const slot of slots) {
    const key = formatInTimeZone(
      new Date(slot.startTime),
      TIMEZONE,
      DAY_FMT,
    );
    const existing = map.get(key);

    if (existing) {
      existing.push(slot);
    } else {
      map.set(key, [slot]);
    }
  }

  return Array.from(map.entries()).sort(([a], [b]) => a.localeCompare(b));
}

export function buildChips(
  slot: TAvailabilitySlot,
  duration: number | null,
): SlotChip[] {
  const windowStart = new Date(slot.startTime);
  const windowFinish = new Date(slot.finishTime);

  if (!duration) {
    return [
      {
        key: slot.startTime,
        label: `${formatInTimeZone(windowStart, TIMEZONE, "HH:mm")} – ${formatInTimeZone(windowFinish, TIMEZONE, "HH:mm")}`,
        startTime: slot.startTime,
        finishTime: slot.finishTime,
      },
    ];
  }

  const chips: SlotChip[] = [];
  const now = new Date();
  let cursor = windowStart;

  while (!isAfter(addMinutes(cursor, duration), windowFinish)) {
    const finish = addMinutes(cursor, duration);

    if (isAfter(cursor, now)) {
      chips.push({
        key: cursor.toISOString(),
        label: formatInTimeZone(cursor, TIMEZONE, "HH:mm"),
        startTime: cursor.toISOString(),
        finishTime: finish.toISOString(),
      });
    }

    cursor = finish;
  }

  return chips;
}
