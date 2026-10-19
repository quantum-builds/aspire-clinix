"use client";

import NoContent1 from "@/app/(dashboards)/components/NoContent1";
import CustomConfirmationModal from "@/app/(dashboards)/components/ConfirmationModal";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { useGetAvailability } from "@/services/availability/availabilityMutation";
import { useCreateCheckoutSession } from "@/services/checkout/checkoutMutation";
import {
  useBookWithPlan,
  useCheckEligibility,
} from "@/services/wellness/wellnessAppointmentMutation";
import { format, isSameDay } from "date-fns";
import { formatInTimeZone } from "date-fns-tz";
import { CalendarDays } from "lucide-react";
import {
  ReactNode,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { showToast } from "@/utils/defaultToastOptions";
import { getCurrentMembership } from "@/services/membership/membershipQuery";

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

const PENDING_CONFIRMATION_KEY = "pendingWellnessConfirmation";

export default function SlotSelection({
  practitionerId,
  treatmentId,
  duration,
}: SlotSelectionProps) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const submittingRef = useRef(false);

  const [selectedDay, setSelectedDay] = useState<Date | null>(null);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [stored, setStored] = useState<StoredSlot | null>(null);
  const [selectedSlotKey, setSelectedSlotKey] = useState<string | null>(null);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [confirmationMode, setConfirmationMode] = useState<
    "login" | "plan" | "standard" | null
  >(null);
  const [isCheckingPlan, setIsCheckingPlan] = useState(false);
  const [isProcessingPlanBooking, setIsProcessingPlanBooking] = useState(false);
  const [paidModalType, setPaidModalType] = useState<
    "PLAN_LIMIT" | "HYPERBARIC_LIMIT" | null
  >(null);
  const [pendingSlot, setPendingSlot] = useState<{
    dayKey: string;
    chip: SlotChip;
  } | null>(null);

  const prepareConfirmation = useCallback(async () => {
    if (status === "loading") return;

    if (status !== "authenticated") {
      setConfirmationMode("login");
      setShowConfirmation(true);
      return;
    }

    setIsCheckingPlan(true);

    try {
      const membershipRes = await getCurrentMembership();
      const membership =
        membershipRes?.status && membershipRes.data
          ? membershipRes.data
          : null;
      const hasActivePlan = Boolean(
        membership && membership.status === "ACTIVE" && membership.plan,
      );

      setConfirmationMode(hasActivePlan ? "plan" : "standard");
      setShowConfirmation(true);
    } catch (error) {
      console.error("Failed to check membership:", error);
      showToast("error", "Unable to check your plan. Please try again.");
    } finally {
      setIsCheckingPlan(false);
    }
  }, [status]);

  const appointmentDuration = useMemo(() => {
    const parsed = Number(duration);

    return duration && Number.isInteger(parsed) && parsed > 0 ? parsed : null;
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

        if (
          window.sessionStorage.getItem(PENDING_CONFIRMATION_KEY) === "true"
        ) {
          window.sessionStorage.removeItem(PENDING_CONFIRMATION_KEY);

          const dayKey = formatInTimeZone(
            new Date(parsed.startTime),
            TIMEZONE,
            DAY_FMT,
          );

          setPendingSlot({
            dayKey,
            chip: {
              key: parsed.startTime,
              label: formatInTimeZone(
                new Date(parsed.startTime),
                TIMEZONE,
                "HH:mm",
              ),
              startTime: parsed.startTime,
              finishTime: parsed.finishTime,
            },
          });

          setSelectedDay(keyToLocalDate(dayKey));
          void prepareConfirmation();
        }
      }
    } catch (error) {
      console.error("Failed to load stored slot:", error);
    }
  }, [prepareConfirmation, practitionerId, treatmentId]);

  const todayKey = todayKeyLondon();

  const selectedKey = selectedDay ? format(selectedDay, DAY_FMT) : todayKey;

  const range = useMemo(() => buildRange(selectedKey), [selectedKey]);

  const { data, isLoading, refetch: refetchAvailability } = useGetAvailability({
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

  const { mutateAsync: checkEligibility } = useCheckEligibility();
  const { mutateAsync: bookWithPlan } = useBookWithPlan();

  const handleSelect = (dayKey: string, chip: SlotChip) => {
    console.log("Slot clicked:", {
      dayKey,
      chip,
      treatmentId,
      practitionerId,
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
      window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify(storedSlot));

      setStored(storedSlot);
    } catch (error) {
      console.error("Failed to store selected slot:", error);
    }

  
    const nextPendingSlot = { dayKey, chip };
    setPendingSlot(nextPendingSlot);
    void prepareConfirmation();
  };

  const clearPendingBooking = () => {
    setShowConfirmation(false);
    setConfirmationMode(null);
    setPaidModalType(null);
    setPendingSlot(null);
    setSelectedSlotKey(null);
    setStored(null);
    window.sessionStorage.removeItem(STORAGE_KEY);
    window.sessionStorage.removeItem(PENDING_CONFIRMATION_KEY);
  };

  const handleCheckoutFallback = () => {
    if (!pendingSlot) return;

    const patientId = (session?.user as { id?: string })?.id ?? "";

    createCheckoutSession(
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
          console.log("Checkout success:", data);

          if (data.status && data.data?.checkoutUrl) {
            window.location.href = data.data.checkoutUrl;
            return;
          }

          console.error("Checkout URL not returned:", data);

          alert("Unable to start checkout. Please try again.");
        },

        onError: (error) => {
          console.error("Checkout failed:", error);

          alert("Failed to start checkout. Please try again.");
        },
      },
    );
  };

  const handleConfirmAppointment = async () => {
    if (!pendingSlot) return;

    if (submittingRef.current) return;
    submittingRef.current = true;

    try {
      setShowConfirmation(false);
      setConfirmationMode(null);
      handleCheckoutFallback();
    } finally {
      submittingRef.current = false;
    }
  };

  const handleLoginRequiredConfirm = () => {
    if (submittingRef.current) return;
    submittingRef.current = true;

    try {
      window.sessionStorage.setItem(PENDING_CONFIRMATION_KEY, "true");
    } catch (error) {
      console.error("Failed to store pending confirmation:", error);
    }

    const slotUrl = `/patient/plan-selection/slot-selection?practitionerId=${
      practitionerId ?? ""
    }&treatmentId=${treatmentId ?? ""}${
      duration ? `&duration=${encodeURIComponent(duration)}` : ""
    }`;

    router.push(`/patient/login?redirectTo=${encodeURIComponent(slotUrl)}`);
  };

  const handlePaidAppointmentConfirm = () => {
    if (!pendingSlot) return;

    setPaidModalType(null);
    handleCheckoutFallback();
  };

  const handleConfirmPlanBooking = async () => {
    if (!pendingSlot) return;

    if (submittingRef.current) return;
    submittingRef.current = true;
    setIsProcessingPlanBooking(true);

    const patientId = (session?.user as { id?: string })?.id ?? "";

    const bookingPayload = {
      treatmentId: Number(treatmentId),
      practitionerId: practitionerId ?? "",
      startTime: pendingSlot.chip.startTime,
      finishTime: pendingSlot.chip.finishTime,
      reason: "Wellness Appointment",
      patientId,
    };

    try {
      const eligibilityRes = await checkEligibility({
        treatmentId: Number(treatmentId),
      });

      const eligibility = eligibilityRes.data?.status;

      if (eligibility === "PLAN_LIMIT_REACHED") {
        setShowConfirmation(false);
        setConfirmationMode(null);
        setPaidModalType("PLAN_LIMIT");
        return;
      }

      if (eligibility === "HYPERBARIC_LIMIT_REACHED") {
        setShowConfirmation(false);
        setConfirmationMode(null);
        setPaidModalType("HYPERBARIC_LIMIT");
        return;
      }

      if (eligibility !== "OK") {
        setShowConfirmation(false);
        setConfirmationMode(null);
        handleCheckoutFallback();
        return;
      }

      const bookingRes = await bookWithPlan(bookingPayload);
      const outcome = bookingRes.data?.status;

      if (outcome === "OK") {
        showToast("success", "Appointment booked successfully!");
        clearPendingBooking();

        const remaining =
          bookingRes.data?.remainingTreatments === null
            ? "unlimited"
            : String(bookingRes.data?.remainingTreatments ?? "");
        const remainingHyperbaric =
          bookingRes.data?.remainingHyperbaric === null
            ? "unlimited"
            : String(bookingRes.data?.remainingHyperbaric ?? "");

        window.location.href = `/patient/plan-selection/appointment-booked?appointmentId=${
          bookingRes.data?.appointmentId
        }&treatmentId=${treatmentId ?? ""}&startTime=${encodeURIComponent(
          pendingSlot.chip.startTime,
        )}&finishTime=${encodeURIComponent(
          pendingSlot.chip.finishTime,
        )}${remaining ? `&remaining=${remaining}` : ""}${
          remainingHyperbaric
            ? `&remainingHyperbaric=${remainingHyperbaric}`
            : ""
        }`;
        return;
      }

      if (outcome === "SLOT_TAKEN") {
        showToast(
          "error",
          bookingRes.message ||
            "This slot is no longer available. Please select another time.",
        );
        clearPendingBooking();
        refetchAvailability();
        return;
      }

      if (
        outcome === "PLAN_LIMIT_REACHED" ||
        outcome === "HYPERBARIC_LIMIT_REACHED"
      ) {
        setShowConfirmation(false);
        setConfirmationMode(null);
        setPaidModalType(
          outcome === "PLAN_LIMIT_REACHED" ? "PLAN_LIMIT" : "HYPERBARIC_LIMIT",
        );
        return;
      }

      setShowConfirmation(false);
      setConfirmationMode(null);
      handleCheckoutFallback();
    } catch (error) {
      console.error("Plan booking failed:", error);
      showToast("error", "Failed to book appointment. Please try again.");
    } finally {
      setIsProcessingPlanBooking(false);
      submittingRef.current = false;
    }
  };

  if (!practitionerId) {
    return (
      <NoContent1 text="No practitioner selected. Please go back and choose a practitioner." appointmentFlow={true} />
    );
  }

  const slots = data && data.status ? (data.data ?? []) : [];

  const allDayKeys: string[] = [];

  for (let i = 0; i < 7; i++) {
    const date = new Date(`${selectedKey}T12:00:00`);

    date.setDate(date.getDate() + i);

    allDayKeys.push(format(date, DAY_FMT));
  }

  const grouped = groupByDate(slots);

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
        appointmentFlow={true}
      />
    );
  } else {
    slotsContent = (
      <div className="flex w-full flex-col gap-6">
        {rows.map((row) => (
          <div key={row.dayKey} className="text-left">
            <h3 className="mb-3 font-[family-name:var(--font-cormorant)] text-[24px] font-normal leading-[30px] tracking-[0.9px] text-[var(--wt-name)] sm:text-[28px]">
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
                      disabled={isPending}
                      onClick={() => handleSelect(row.dayKey, chip)}
                      className={cn(
                        "flex items-center justify-center rounded-full border border-white/15 px-4 py-2 font-gillSans text-sm text-[var(--wt-name)] transition hover:border-[var(--wt-amount)]/60",
                        isSelected &&
                        "border-transparent bg-[var(--wt-btn)] text-[#0b0a08] hover:border-transparent",
                        isPending &&
                        "cursor-not-allowed opacity-50",
                      )}
                    >
                      {isPending && isSelected ? (
                        <div className="h-4 w-4 animate-spin rounded-full border-2 border-[#0b0a08] border-t-transparent" />
                      ) : (
                        chip.label
                      )}
                    </button>
                  );
                })}
              </div>
            ) : (
              <p className="font-gillSans text-sm text-[var(--wt-desc)]">
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
    <div className="flex flex-col items-center gap-6">
      <div className="flex w-full justify-end">
        <button
          type="button"
          onClick={() => setIsCalendarOpen((open) => !open)}
          className="inline-flex h-9 items-center justify-center gap-2 rounded-full  border-white/15 bg-[var(--wt-amount)] px-6 py-[10px] font-gillSans text-sm font-medium uppercase tracking-wide text-[#0b0a08] transition hover:opacity-90"
          aria-expanded={isCalendarOpen}
        >
          <CalendarDays
            className="h-4 w-4"
            strokeWidth={1.5}
            aria-hidden="true"
          />
          <p className="mt-1">
            Change Date
          </p>
        </button>
      </div>

      {isCalendarOpen && (
        <div className="wt-calendar flex flex-col items-center gap-3 rounded-2xl border border-white/10 bg-[#12100D] p-4">
          <Calendar
            mode="single"
            selected={selectedDay ?? undefined}
            onSelect={(day) => {
              if (!day || (selectedDay && isSameDay(day, selectedDay))) {
                return;
              }
              setSelectedDay(day);
              setIsCalendarOpen(false);
            }}
            disabled={{ before: keyToLocalDate(todayKey) }}
            className="!bg-transparent !p-0 text-[var(--wt-name)]"
          />

          {selectedDay && (
            <button
              type="button"
              onClick={() => {
                setSelectedDay(null);
                setIsCalendarOpen(false);
              }}
              className="font-gillSans text-sm text-[var(--wt-amount)] underline underline-offset-4 hover:opacity-80"
            >
              Reset to today
            </button>
          )}
        </div>
      )}
      {storedMatches && stored && (
        <div className="w-full rounded-2xl border border-white/15 bg-[#56493A73] px-5 py-4 text-left">
          <p className="font-gillSans text-xs uppercase tracking-[0.18em] text-[var(--wt-amount)]">
            Selected slot
          </p>

          <p className="mt-1 font-gillSans text-base text-[var(--wt-name)]">
            {formatInTimeZone(
              new Date(stored.startTime),
              TIMEZONE,
              "EEEE, dd MMMM yyyy 'at' HH:mm",
            )}
          </p>
        </div>
      )}

      {error && (
        <p className="font-gillSans text-sm text-red-400">
          Failed to load checkout. Please try again.
        </p>
      )}

      {slotsContent}

      <CustomConfirmationModal
        theme="dark"
        isOpen={showConfirmation}
        onClose={clearPendingBooking}
        onConfirm={
          confirmationMode === "login"
            ? handleLoginRequiredConfirm
            : confirmationMode === "plan"
              ? handleConfirmPlanBooking
              : handleConfirmAppointment
        }
        isPending={isCheckingPlan || isProcessingPlanBooking}
        title={
          confirmationMode === "login"
            ? "Confirm Your Appointment"
            : confirmationMode === "plan"
              ? "Confirm Your Wellness Appointment"
              : "Confirm Appointment"
        }
        description={
          confirmationMode === "login"
            ? (
                <>
                  You’ve selected a time slot for your Wellness Appointment.
                  Please <strong>log in</strong> to your account to continue
                  and confirm your booking.
                </>
              )
            : confirmationMode === "plan"
              ? "You’ve selected a time slot for your Wellness Appointment. This appointment will be booked using your current membership plan. Do you want to continue?"
                : (
                    <>
                      Are you sure you want to proceed with booking this
                      appointment? After confirmation, you’ll be redirected to{" "}
                      <strong>Stripe</strong> to complete your payment.
                    </>
                  )
        }
        confirmText={
          confirmationMode === "login"
            ? "Log In"
            : confirmationMode === "plan"
              ? "Confirm Appointment"
              : "Confirm"
        }
        cancelText="Cancel"
      />

      <CustomConfirmationModal
        theme="dark"
        isOpen={paidModalType !== null}
        onClose={() => setPaidModalType(null)}
        onConfirm={handlePaidAppointmentConfirm}
        isPending={isPending}
        title={
          paidModalType === "PLAN_LIMIT"
            ? "Plan Treatments Used"
            : "Hyperbaric Sessions Used"
        }
        description={
          paidModalType === "PLAN_LIMIT"
            ? "You have used all treatments in your current plan this month. Would you like to book a single paid appointment?"
            : "You have used all Hyperbaric sessions included in your plan this month. Would you like to book a single paid appointment?"
        }
        confirmText="Yes"
        cancelText="No"
      />
    </div>
  );
}
