"use client";

import NoContent1 from "@/app/(dashboards)/components/NoContent1";
import CustomConfirmationModal from "@/app/(dashboards)/components/ConfirmationModal";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { useGetAvailability } from "@/services/availability/availabilityMutation";
import { useCreateCheckoutSession } from "@/services/checkout/checkoutMutation";
import { useBookMembershipAppointment } from "@/services/membership/membershipMutation";
import { format, isSameDay } from "date-fns";
import { formatInTimeZone } from "date-fns-tz";
import { CalendarDays } from "lucide-react";
import { ReactNode, useEffect, useMemo, useState } from "react";
import { useSession } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import { showToast } from "@/utils/defaultToastOptions";

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
  const { data: session } = useSession();
  const searchParams = useSearchParams();
  const isMembershipBooking = searchParams.get("type") === "membership";

  const [selectedDay, setSelectedDay] = useState<Date | null>(null);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [stored, setStored] = useState<StoredSlot | null>(null);
  const [selectedSlotKey, setSelectedSlotKey] = useState<string | null>(null);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [pendingSlot, setPendingSlot] = useState<{
    dayKey: string;
    chip: SlotChip;
  } | null>(null);

  const appointmentDuration = useMemo(() => {
    const parsed = Number(duration);

    return duration && Number.isInteger(parsed) && parsed > 0
      ? parsed
      : null;
  }, [duration]);

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
    } catch (error) {
      console.error("Failed to load stored slot:", error);
    }
  }, [practitionerId, treatmentId]);

  const todayKey = todayKeyLondon();

  const selectedKey = selectedDay
    ? format(selectedDay, DAY_FMT)
    : todayKey;

  const range = useMemo(
    () => buildRange(selectedKey),
    [selectedKey],
  );

  const { data, isLoading } = useGetAvailability({
    practitionerId,
    startTime: range.startTime,
    finishTime: range.finishTime,
    duration: appointmentDuration,
  });

  const {
    mutate: createCheckoutSession,
    isPending,
    error,
  } = useCreateCheckoutSession();

  const {
    mutate: bookMembershipAppointment,
    isPending: isBookingMembership,
  } = useBookMembershipAppointment();

  const handleSelect = (dayKey: string, chip: SlotChip) => {
    const patientId =
      (session?.user as { id?: string })?.id ?? "";

    console.log("Slot clicked:", {
      dayKey,
      chip,
      treatmentId,
      practitionerId,
      patientId,
      startTime: chip.startTime,
      finishTime: chip.finishTime,
    });

    setSelectedSlotKey(chip.key);

    const storedSlot: StoredSlot = {
      practitionerId: practitionerId ?? "",
      treatmentId: treatmentId ?? "",
      startTime: chip.startTime,
      finishTime: chip.finishTime,
    };

    try {
      window.sessionStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(storedSlot),
      );

      setStored(storedSlot);
    } catch (error) {
      console.error("Failed to store selected slot:", error);
    }

    // If membership booking, show confirmation modal
    if (isMembershipBooking) {
      setPendingSlot({ dayKey, chip });
      setShowConfirmation(true);
      return;
    }

    // Otherwise, use existing Stripe checkout flow
    createCheckoutSession(
      {
        treatmentId: Number(treatmentId),
        practitionerId: practitionerId ?? "",
        startTime: chip.startTime,
        finishTime: chip.finishTime,
        reason: "Wellness Appointment",
        patientId,
      },
      {
        onSuccess: (data) => {
          console.log("Checkout success:", data);

          if (data.status && data.data?.checkoutUrl) {
            window.location.href = data.data.checkoutUrl;
            return;
          }

          console.error("Checkout URL not returned:", data);

          alert(
            "Unable to start checkout. Please try again.",
          );
        },

        onError: (error) => {
          console.error("Checkout failed:", error);

          alert(
            "Failed to start checkout. Please try again.",
          );
        },
      },
    );
  };

  const handleConfirmMembershipBooking = () => {
    if (!pendingSlot) return;

    const patientId =
      (session?.user as { id?: string })?.id ?? "";

    bookMembershipAppointment(
      {
        treatmentId: Number(treatmentId),
        practitionerId: practitionerId ?? "",
        startTime: pendingSlot.chip.startTime,
        finishTime: pendingSlot.chip.finishTime,
        reason: "Wellness Appointment",
        patientId,
      },
      {
        onSuccess: (data) => {
          console.log("Membership booking success:", data);
          showToast("success", "Appointment booked successfully!");
          setShowConfirmation(false);
          setPendingSlot(null);
          setSelectedSlotKey(null);
          setStored(null);
          window.sessionStorage.removeItem(STORAGE_KEY);
          // Redirect to appointments page or show success
          window.location.href = "/patient/appointments/upcoming";
        },
        onError: (error) => {
          console.error("Membership booking failed:", error);
          showToast("error", "Failed to book appointment. Please try again.");
          setShowConfirmation(false);
          setPendingSlot(null);
          setSelectedSlotKey(null);
          setStored(null);
          window.sessionStorage.removeItem(STORAGE_KEY);
        },
      },
    );
  };

  if (!practitionerId) {
    return (
      <NoContent1 text="No practitioner selected. Please go back and choose a practitioner." />
    );
  }

  const slots =
    data && data.status
      ? (data.data ?? [])
      : [];

  const allDayKeys: string[] = [];

  for (let i = 0; i < 7; i++) {
    const date = new Date(`${selectedKey}T12:00:00`);

    date.setDate(date.getDate() + i);

    allDayKeys.push(format(date, DAY_FMT));
  }

  const grouped = groupByDate(slots);

  const rows = allDayKeys.map((dayKey) => {
    const daySlots =
      grouped.find(([key]) => key === dayKey)?.[1] ?? [];

    return {
      dayKey,
      chips: daySlots.flatMap((slot) =>
        buildChips(slot, appointmentDuration),
      ),
    };
  });

  let slotsContent: ReactNode;

  if (isLoading) {
    slotsContent = <SlotSelectionSkeleton />;
  } else if (!data || !data.status) {
    slotsContent = (
      <NoContent1
        text={
          data?.message ||
          "Unable to load availability right now."
        }
      />
    );
  } else {
    slotsContent = (
      <div className="flex w-full flex-col gap-5">
        {rows.map((row) => (
          <div
            key={row.dayKey}
            className="text-left"
          >
            <h3 className="mb-3 font-opus text-xl font-medium text-dashboardTextBlack">
              {dayLabel(row.dayKey)}
            </h3>

            {row.chips.length > 0 ? (
              <div className="flex flex-wrap gap-3">
                {row.chips.map((chip) => {
                  const isSelected =
                    selectedSlotKey === chip.key;

                  return (
                    <button
                      key={chip.key}
                      type="button"
                      disabled={isPending || isBookingMembership}
                      onClick={() =>
                        handleSelect(
                          row.dayKey,
                          chip,
                        )
                      }
                      className={cn(
                        "flex items-center justify-center rounded-[100px] border border-green px-4 py-2 font-gillSans text-sm text-dashboardTextBlack transition hover:border-green-600",
                        isSelected &&
                          "bg-green text-dashboardTextBarBackground hover:bg-green",
                        (isPending || isBookingMembership) &&
                          "cursor-not-allowed opacity-50",
                      )}
                    >
                      {isPending && isSelected ? (
                        <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                      ) : (
                        chip.label
                      )}
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
    stored &&
      stored.practitionerId === practitionerId &&
      stored.treatmentId === treatmentId,
  );

  return (
    <div className="flex w-full flex-col items-center gap-6">
      <div className="flex w-full justify-end">
        <button
          type="button"
          onClick={() =>
            setIsCalendarOpen((open) => !open)
          }
          className="inline-flex items-center gap-2 rounded-full border border-green px-4 py-2 font-gillSans text-sm text-dashboardTextBlack transition hover:bg-green hover:text-dashboardTextBarBackground"
          aria-expanded={isCalendarOpen}
        >
          <CalendarDays
            className="h-4 w-4"
            aria-hidden="true"
          />

          Change Date
        </button>
      </div>

      {isCalendarOpen && (
        <div className="flex flex-col items-center gap-3">
          <Calendar
            mode="single"
            selected={selectedDay ?? undefined}
            onSelect={(day) => {
              if (
                !day ||
                (selectedDay &&
                  isSameDay(day, selectedDay))
              ) {
                return;
              }

              setSelectedDay(day);
              setIsCalendarOpen(false);
            }}
            disabled={{
              before: keyToLocalDate(todayKey),
            }}
          />

          {selectedDay && (
            <button
              type="button"
              onClick={() => {
                setSelectedDay(null);
                setIsCalendarOpen(false);
              }}
              className="font-gillSans text-sm text-green underline"
            >
              Reset to today
            </button>
          )}
        </div>
      )}

      {storedMatches && stored && (
        <div className="w-full rounded-2xl border border-green px-4 py-3 text-left">
          <p className="font-gillSans text-sm text-lightBlack">
            Selected slot
          </p>

          <p className="font-gillSans text-base text-dashboardTextBlack">
            {formatInTimeZone(
              new Date(stored.startTime),
              TIMEZONE,
              "EEEE, dd MMMM yyyy 'at' HH:mm",
            )}
          </p>
        </div>
      )}

      {error && (
        <p className="font-gillSans text-sm text-red-500">
          Failed to load checkout. Please try again.
        </p>
      )}

      {slotsContent}

      <CustomConfirmationModal
        isOpen={showConfirmation}
        onClose={() => {
          setShowConfirmation(false);
          setPendingSlot(null);
          setSelectedSlotKey(null);
          setStored(null);
          window.sessionStorage.removeItem(STORAGE_KEY);
        }}
        onConfirm={handleConfirmMembershipBooking}
        isPending={isBookingMembership}
        title="Confirm Appointment"
        description="Are you sure you want to book this appointment using your membership plan?"
        confirmText="Confirm"
        cancelText="Cancel"
      />
    </div>
  );
}
