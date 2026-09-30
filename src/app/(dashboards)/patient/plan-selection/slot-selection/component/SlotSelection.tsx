"use client";

import NoContent1 from "@/app/(dashboards)/components/NoContent1";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { useGetAvailability } from "@/services/availability/availabilityMutation";
import { TAvailabilitySlot } from "@/types/common";
import { format, isSameDay } from "date-fns";
import { formatInTimeZone } from "date-fns-tz";
import { ReactNode, useEffect, useMemo, useState } from "react";
import {
  buildChips,
  buildRange,
  DAY_FMT,
  dayLabel,
  groupByDate,
  keyToLocalDate,
  SlotChip,
  STORAGE_KEY,
  StoredSlot,
  TIMEZONE,
  todayKeyLondon,
} from "@/utils/slotSelectionUtils";
import { SlotSelectionSkeleton } from "./skeletons/SlotSelectionSkeleton";

interface SlotSelectionProps {
  practitionerId?: string;
  treatmentId?: string;
  duration?: string;
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
      // ignore storage errors
    }
  }, [practitionerId, treatmentId]);

  // The calendar gives a local Date; we only read its Y/M/D and treat it as a London date.
  const todayKey = todayKeyLondon();
  const selectedKey = selectedDay ? format(selectedDay, DAY_FMT) : todayKey;

  const range = useMemo(() => buildRange(selectedKey), [selectedKey]);

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
      // ignore storage errors
    }

    setStored(entry);
    setSelectedSlotKey(chip.key);
  };

  if (!practitionerId) {
    return (
      <NoContent1 text="No practitioner selected. Please go back and choose a practitioner." />
    );
  }

  const slots = data && data.status ? (data.data ?? []) : [];

  // Generate all 7 day keys for the range
  const allDayKeys: string[] = [];
  for (let i = 0; i < 7; i++) {
    const d = new Date(selectedKey + "T12:00:00");
    d.setDate(d.getDate() + i);
    allDayKeys.push(format(d, DAY_FMT));
  }

  // Group slots by date
  const grouped = groupByDate(slots);

  // Build rows for all 7 days (show empty days too)
  const rows = allDayKeys.map((dayKey) => {
    const daySlots = grouped.find(([key]) => key === dayKey)?.[1] ?? [];
    return {
      dayKey,
      chips: daySlots.flatMap((slot) => buildChips(slot, appointmentDuration)),
    };
  });

  let slotsContent: ReactNode;

  if (isLoading) {
    slotsContent = <SlotSelectionSkeleton />;
  } else if (!data || !data.status) {
    slotsContent = (
      <NoContent1
        text={data?.message || "Unable to load availability right now."}
      />
    );
  } else {
    slotsContent = (
      <div className="flex w-full flex-col gap-5">
        {rows.map((row) => (
          <div key={row.dayKey} className="text-left">
            <h3 className="mb-3 font-opus text-xl font-medium text-dashboardTextBlack">
              {dayLabel(row.dayKey)}
            </h3>

            {row.chips.length > 0 ? (
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
                          "bg-green text-dashboardTextBarBackground hover:bg-green",
                      )}
                    >
                      {chip.label}
                    </button>
                  );
                })}
              </div>
            ) : (
              <p className="font-gillSans text-sm text-lightBlack">
                No slots available for this day
              </p>
            )}
          </div>
        ))}
      </div>
    );
  }

  const storedMatches = Boolean(
    stored && stored.practitionerId === practitionerId,
  );

  return (
    <div className="flex flex-col items-center gap-6">
      <div className="flex flex-col items-center gap-3">
        <Calendar
          mode="single"
          selected={selectedDay ?? undefined}
          onSelect={(day) => {
            if (!day || (selectedDay && isSameDay(day, selectedDay))) return;
            setSelectedDay(day);
          }}
          disabled={{ before: keyToLocalDate(todayKey) }}
        />

        <div className="flex flex-wrap items-center justify-center gap-3">
          {selectedDay && (
            <button
              type="button"
              onClick={() => {
                setSelectedDay(null);
              }}
              className="font-gillSans text-sm text-green underline"
            >
              Reset to today
            </button>
          )}
        </div>
      </div>

      {storedMatches && stored && (
        <div className="w-full rounded-2xl border border-green px-4 py-3 text-left">
          <p className="font-gillSans text-sm text-lightBlack">Selected slot</p>
          <p className="font-gillSans text-base text-dashboardTextBlack">
            {formatInTimeZone(
              new Date(stored.startTime),
              TIMEZONE,
              "EEEE d MMMM yyyy, HH:mm",
            )}
            {stored.duration ? ` · ${stored.duration} min` : ""}
          </p>
        </div>
      )}

      {slotsContent}
    </div>
  );
}
