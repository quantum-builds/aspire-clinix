"use client";

import NoContent1 from "@/app/(dashboards)/components/NoContent1";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { useGetAvailability } from "@/services/availability/availabilityMutation";
import { TAvailabilitySlot } from "@/types/common";
import {
  addDays,
  addMinutes,
  endOfDay,
  format,
  isAfter,
  isBefore,
  startOfDay,
} from "date-fns";
import { ReactNode, useEffect, useMemo, useState } from "react";
import { SlotSelectionSkeleton } from "./skeletons/SlotSelectionSkeleton";

const STORAGE_KEY = "selectedTreatmentSlot";
const INITIAL_DAYS = 7;

type StoredSlot = {
  date: string;
  startTime: string;
  finishTime: string;
  practitionerId: string;
  treatmentId?: string;
  duration?: number | null;
};

type SlotChip = {
  key: string;
  label: string;
  startTime: string;
  finishTime: string;
};

interface SlotSelectionProps {
  practitionerId?: string;
  treatmentId?: string;
  duration?: string;
}

function toApiTime(date: Date): string {
  return format(date, "yyyy-MM-dd'T'HH:mm:ssXXX");
}

function clampStart(date: Date): Date {
  const now = new Date();
  const dayStart = startOfDay(date);
  return isBefore(dayStart, now) ? now : dayStart;
}

function groupByDate(
  slots: TAvailabilitySlot[],
): Array<[string, TAvailabilitySlot[]]> {
  const map = new Map<string, TAvailabilitySlot[]>();

  for (const slot of slots) {
    const key = slot.startTime.slice(0, 10);
    const existing = map.get(key);

    if (existing) {
      existing.push(slot);
    } else {
      map.set(key, [slot]);
    }
  }

  return Array.from(map.entries()).sort(([a], [b]) => a.localeCompare(b));
}

function dayLabel(dayKey: string): string {
  const [year, month, day] = dayKey.split("-").map(Number);
  return format(new Date(year, month - 1, day), "EEEE d MMMM yyyy");
}

function buildChips(
  slot: TAvailabilitySlot,
  duration: number | null,
): SlotChip[] {
  const windowStart = new Date(slot.startTime);
  const windowFinish = new Date(slot.finishTime);

  if (!duration) {
    return [
      {
        key: slot.startTime,
        label: `${format(windowStart, "HH:mm")} – ${format(windowFinish, "HH:mm")}`,
        startTime: slot.startTime,
        finishTime: slot.finishTime,
      },
    ];
  }

  const chips: SlotChip[] = [];
  let cursor = windowStart;

  while (!isAfter(addMinutes(cursor, duration), windowFinish)) {
    const finish = addMinutes(cursor, duration);

    chips.push({
      key: cursor.toISOString(),
      label: format(cursor, "HH:mm"),
      startTime: cursor.toISOString(),
      finishTime: finish.toISOString(),
    });

    cursor = finish;
  }

  return chips;
}

export default function SlotSelection({
  practitionerId,
  treatmentId,
  duration,
}: SlotSelectionProps) {
  const appointmentDuration = useMemo(() => {
    const parsed = Number(duration);
    return duration && Number.isInteger(parsed) && parsed > 0 ? parsed : null;
  }, [duration]);

  const [initialRange] = useState(() => {
    const now = new Date();
    return {
      startTime: toApiTime(clampStart(now)),
      finishTime: toApiTime(endOfDay(addDays(now, INITIAL_DAYS))),
    };
  });

  const [selectedDay, setSelectedDay] = useState<Date | null>(null);
  const [stored, setStored] = useState<StoredSlot | null>(null);
  const [selectedSlotKey, setSelectedSlotKey] = useState<string | null>(null);

  useEffect(() => {
    try {
      const raw = window.sessionStorage.getItem(STORAGE_KEY);
      if (!raw) return;

      const parsed = JSON.parse(raw) as StoredSlot;
      setStored(parsed);

      if (
        parsed.practitionerId === practitionerId &&
        parsed.treatmentId === treatmentId
      ) {
        setSelectedSlotKey(parsed.startTime);
      }
    } catch {
      // ignore corrupted or unavailable storage
    }
  }, [practitionerId, treatmentId]);

  const range = selectedDay
    ? {
        startTime: toApiTime(clampStart(selectedDay)),
        finishTime: toApiTime(endOfDay(selectedDay)),
      }
    : initialRange;

  const { data, isLoading } = useGetAvailability({
    practitionerId,
    startTime: range.startTime,
    finishTime: range.finishTime,
    duration: appointmentDuration,
  });

  const handleSelect = (dayKey: string, chip: SlotChip) => {
    const entry: StoredSlot = {
      date: dayKey,
      startTime: chip.startTime,
      finishTime: chip.finishTime,
      practitionerId: practitionerId ?? "",
      treatmentId,
      duration: appointmentDuration,
    };

    try {
      window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify(entry));
    } catch {
      // storage unavailable — selection is still kept in state
    }

    setStored(entry);
    setSelectedSlotKey(chip.key);
  };

  if (!practitionerId) {
    return (
      <NoContent1 text="No practitioner selected. Please go back and choose a practitioner." />
    );
  }

  const slots = data && data.status ? data.data ?? [] : [];

  const rows = groupByDate(slots)
    .map(([dayKey, daySlots]) => ({
      dayKey,
      chips: daySlots.flatMap((slot) => buildChips(slot, appointmentDuration)),
    }))
    .filter((row) => row.chips.length > 0);

  let slotsContent: ReactNode;

  if (isLoading) {
    slotsContent = <SlotSelectionSkeleton />;
  } else if (!data || !data.status) {
    slotsContent = (
      <NoContent1
        text={data?.message || "Unable to load availability right now."}
      />
    );
  } else if (rows.length === 0) {
    slotsContent = (
      <NoContent1 text="No availability for the selected date. Try another date." />
    );
  } else {
    slotsContent = (
      <div className="flex w-full flex-col gap-5">
        {rows.map((row) => (
          <div key={row.dayKey} className="text-left">
            <h3 className="mb-3 font-opus text-xl font-medium text-dashboardTextBlack">
              {dayLabel(row.dayKey)}
            </h3>

            <div className="flex flex-wrap gap-3">
              {row.chips.map((chip) => {
                const isSelected = selectedSlotKey === chip.key;

                return (
                  <button
                    key={chip.key}
                    type="button"
                    onClick={() => handleSelect(row.dayKey, chip)}
                    className={cn(
                      "rounded-[100px] border border-green px-4 py-2 font-gillSans text-sm text-dashboardTextBlack transition hover:border-green-600",
                      isSelected &&
                        "bg-green text-dashboardBarBackground hover:bg-green",
                    )}
                  >
                    {chip.label}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    );
  }

  const storedMatches = Boolean(stored && stored.practitionerId === practitionerId);

  return (
    <div className="flex flex-col items-center gap-6">
      <div className="flex flex-col items-center gap-3">
        <Calendar
          mode="single"
          selected={selectedDay ?? undefined}
          onSelect={(day) => setSelectedDay(day ?? null)}
          disabled={{ before: startOfDay(new Date()) }}
        />

        <div className="flex flex-wrap items-center justify-center gap-3">
          <p className="font-gillSans text-base text-lightBlack">
            {selectedDay
              ? format(selectedDay, "EEEE d MMMM yyyy")
              : `Next ${INITIAL_DAYS} days`}
          </p>

          {selectedDay && (
            <button
              type="button"
              onClick={() => setSelectedDay(null)}
              className="font-gillSans text-sm text-green underline"
            >
              Show next {INITIAL_DAYS} days
            </button>
          )}
        </div>
      </div>

      {storedMatches && stored && (
        <div className="w-full rounded-2xl border border-green px-4 py-3 text-left">
          <p className="font-gillSans text-sm text-lightBlack">Selected slot</p>
          <p className="font-gillSans text-base text-dashboardTextBlack">
            {format(new Date(stored.startTime), "EEEE d MMMM yyyy, HH:mm")}
            {stored.duration ? ` · ${stored.duration} min` : ""}
          </p>
        </div>
      )}

      {slotsContent}
    </div>
  );
}
