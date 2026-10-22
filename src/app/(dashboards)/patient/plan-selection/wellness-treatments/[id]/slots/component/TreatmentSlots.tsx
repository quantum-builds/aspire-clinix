"use client";

import NoContent1 from "@/app/(dashboards)/components/NoContent1";
import CustomConfirmationModal from "@/app/(dashboards)/components/ConfirmationModal";
import { SlotSelectionSkeleton } from "@/app/(dashboards)/patient/plan-selection/slot-selection/component/skeletons/SlotSelectionSkeleton";
import { cn } from "@/lib/utils";
import { useBookSession } from "@/services/sessions/sessionMutation";
import { useGetTreatment } from "@/services/treatments/treatmentQuery";
import { TAvailability } from "@/types/treatment";
import { showToast } from "@/utils/defaultToastOptions";
import { getAxiosErrorMessage } from "@/utils/getAxiosErrorMessage";
import { dayLabel, TIMEZONE } from "@/utils/slotSelectionUtils";
import { fromZonedTime } from "date-fns-tz";
import { useSession } from "next-auth/react";
import { useParams, useRouter } from "next/navigation";
import { ReactNode, useEffect, useRef, useState } from "react";

const PENDING_SESSION_KEY = "pendingTreatmentSession";

type TimeChip = {
  key: string;
  date: string;
  startTime: string;
  finishTime: string;
  disabled: boolean;
};

function toTimeChip(slot: TAvailability): TimeChip {
  const isPast =
    fromZonedTime(`${slot.date}T${slot.startTime}:00`, TIMEZONE).getTime() <=
    Date.now();

  return {
    key: `${slot.date}-${slot.startTime}-${slot.finishTime}`,
    date: slot.date,
    startTime: slot.startTime,
    finishTime: slot.finishTime,
    disabled: isPast || slot.remainingLimit <= 0,
  };
}

export default function TreatmentSlots() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { status } = useSession();
  const submittingRef = useRef(false);

  const {
    data: treatment,
    isLoading,
    isError,
    refetch: refetchTreatment,
  } = useGetTreatment(id);
  const { mutateAsync: bookSession, isPending } = useBookSession();

  const [pendingChip, setPendingChip] = useState<TimeChip | null>(null);
  const [confirmationMode, setConfirmationMode] = useState<
    "login" | "book" | null
  >(null);
  const [paidModalType, setPaidModalType] = useState<
    "PLAN_LIMIT_REACHED" | "BREATHWORK_LIMIT_REACHED" | null
  >(null);

  // Restore the slot picked before login and reopen its confirmation.
  useEffect(() => {
    if (status !== "authenticated" || !treatment) return;

    try {
      const raw = window.sessionStorage.getItem(PENDING_SESSION_KEY);

      if (!raw) return;

      window.sessionStorage.removeItem(PENDING_SESSION_KEY);

      const stored = JSON.parse(raw) as {
        treatmentId: string;
        date: string;
        startTime: string;
      };

      if (stored.treatmentId !== id) return;

      const slot = treatment.availabilities?.find(
        (availability) =>
          availability.date === stored.date &&
          availability.startTime === stored.startTime,
      );
      const chip = slot ? toTimeChip(slot) : null;

      if (!chip || chip.disabled) {
        showToast(
          "error",
          "The slot you selected is no longer available. Please choose another.",
        );
        return;
      }

      setPendingChip(chip);
      setConfirmationMode("book");
    } catch (error) {
      console.error("Failed to restore selected slot:", error);
    }
  }, [status, treatment, id]);

  const clearPendingBooking = () => {
    setConfirmationMode(null);
    setPaidModalType(null);
    setPendingChip(null);

    try {
      window.sessionStorage.removeItem(PENDING_SESSION_KEY);
    } catch (error) {
      console.error("Failed to clear selected slot:", error);
    }
  };

  const handleSelect = (chip: TimeChip) => {
    if (status === "loading") return;

    setPendingChip(chip);
    setConfirmationMode(status === "authenticated" ? "book" : "login");
  };

  const handleLoginRequiredConfirm = () => {
    if (pendingChip) {
      try {
        window.sessionStorage.setItem(
          PENDING_SESSION_KEY,
          JSON.stringify({
            treatmentId: id,
            date: pendingChip.date,
            startTime: pendingChip.startTime,
            finishTime: pendingChip.finishTime,
          }),
        );
      } catch (error) {
        console.error("Failed to store selected slot:", error);
      }
    }

    const slotUrl = `/patient/plan-selection/wellness-treatments/${id}/slots`;
    router.push(`/patient/login?redirectTo=${encodeURIComponent(slotUrl)}`);
  };

  const submitBooking = async (payWithStripe: boolean) => {
    if (!pendingChip || submittingRef.current) return;
    submittingRef.current = true;

    try {
      const bookingRes = await bookSession({
        treatmentId: id,
        date: pendingChip.date,
        startTime: pendingChip.startTime,
        payWithStripe,
      });
      const outcome = bookingRes.data?.status;

      if (outcome === "CHECKOUT" && bookingRes.data?.checkoutUrl) {
        window.location.href = bookingRes.data.checkoutUrl;
        return;
      }

      if (outcome === "BOOKED" && bookingRes.data?.session) {
        showToast("success", "Appointment booked successfully!");

        const remaining =
          bookingRes.data.remainingTreatments === null
            ? "unlimited"
            : String(bookingRes.data.remainingTreatments ?? "");

        window.location.href = `/patient/plan-selection/appointment-booked?startTime=${encodeURIComponent(
          bookingRes.data.session.startTime,
        )}&finishTime=${encodeURIComponent(
          bookingRes.data.session.endTime,
        )}${remaining ? `&remaining=${remaining}` : ""}`;
        return;
      }

      if (
        outcome === "PLAN_LIMIT_REACHED" ||
        outcome === "BREATHWORK_LIMIT_REACHED"
      ) {
        setConfirmationMode(null);
        setPaidModalType(outcome);
        return;
      }

      showToast("error", "Failed to book appointment. Please try again.");
      clearPendingBooking();
    } catch (error) {
      showToast("error", getAxiosErrorMessage(error));
      clearPendingBooking();
      refetchTreatment();
    } finally {
      submittingRef.current = false;
    }
  };

  let slotsContent: ReactNode;

  if (isLoading) {
    slotsContent = <SlotSelectionSkeleton />;
  } else if (isError || !treatment) {
    slotsContent = (
      <NoContent1 text="Treatment not found." appointmentFlow={true} />
    );
  } else if (!treatment.availabilities || treatment.availabilities.length === 0) {
    slotsContent = (
      <NoContent1
        text="No slots available for this treatment yet."
        appointmentFlow={true}
      />
    );
  } else {
    const rows = [...treatment.availabilities]
      .sort(
        (a, b) =>
          a.date.localeCompare(b.date) || a.startTime.localeCompare(b.startTime),
      )
      .reduce<[string, TimeChip[]][]>((groups, slot) => {
        const chip = toTimeChip(slot);
        const lastGroup = groups[groups.length - 1];

        if (lastGroup && lastGroup[0] === slot.date) {
          lastGroup[1].push(chip);
        } else {
          groups.push([slot.date, [chip]]);
        }

        return groups;
      }, []);

    slotsContent = (
      <div className="flex w-full flex-col gap-6">
        {rows.map(([dayKey, chips]) => (
          <div key={dayKey} className="text-left">
            <h3 className="mb-3 font-[family-name:var(--font-cormorant)] text-[24px] font-normal leading-[30px] tracking-[0.9px] text-[var(--wt-name)] sm:text-[28px]">
              {dayLabel(dayKey)}
            </h3>

            {chips.some((chip) => !chip.disabled) ? (
              <div className="flex flex-wrap gap-3">
                {chips.map((chip) => {
                  const isSelected = pendingChip?.key === chip.key;

                  return (
                    <button
                      key={chip.key}
                      type="button"
                      disabled={chip.disabled || isPending}
                      onClick={() => handleSelect(chip)}
                      className={cn(
                        "flex items-center justify-center rounded-full border border-white/15 px-4 py-2 font-gillSans text-sm text-[var(--wt-name)] transition hover:border-[var(--wt-amount)]/60",
                        isSelected &&
                          "border-transparent bg-[var(--wt-btn)] text-[#0b0a08] hover:border-transparent",
                        (chip.disabled || isPending) &&
                          "cursor-not-allowed opacity-50",
                      )}
                    >
                      {isPending && isSelected ? (
                        <div className="h-4 w-4 animate-spin rounded-full border-2 border-[#0b0a08] border-t-transparent" />
                      ) : (
                        `${chip.startTime} – ${chip.finishTime}`
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

  return (
    <main className="relative  px-4 py-20 sm:px-6 lg:px-8">
      <div
        aria-hidden
        className="pointer-events-none absolute left-[-250px] top-0 h-[750px] w-[1100px] bg-[radial-gradient(ellipse_at_center,rgba(214,188,160,0.18)_0%,rgba(255,255,255,0)_65%)]"
      />

      <div className="relative mx-auto w-full max-w-[1000px]">
        <section className="w-full pb-16 pt-6 text-center">
          <div className="mx-auto max-w-3xl">
            <h1 className="font-[family-name:var(--font-cormorant)] text-[40px] font-normal leading-[44px] tracking-[-1px] text-[var(--wt-heading)] sm:text-[66px] sm:leading-[66px] sm:tracking-[-1.65px]">
              Select a Slot
            </h1>
            <p className="mx-auto mt-6 max-w-xl font-gillSans text-lg leading-8 text-[var(--wt-desc)] sm:text-xl">
              Choose an available date and time for your appointment.
            </p>
            {treatment?.name && (
              <p className="mx-auto mt-2 max-w-xl font-gillSans text-base text-[var(--wt-amount)] sm:text-lg">
                {treatment.name}
              </p>
            )}
          </div>

          <div className="mx-auto mt-8 max-w-[800px] rounded-[28px] border  border-white/15 bg-[#56493A73] opacity-0.82 px-6 py-8 shadow-[0_30px_50px_-20px_rgba(0,0,0,0.35)] sm:px-8 sm:py-9">
            {slotsContent}
          </div>
        </section>
      </div>

      <CustomConfirmationModal
        theme="dark"
        isOpen={confirmationMode !== null}
        onClose={clearPendingBooking}
        onConfirm={
          confirmationMode === "login"
            ? handleLoginRequiredConfirm
            : () => void submitBooking(false)
        }
        isPending={isPending}
        title={
          confirmationMode === "login"
            ? "Confirm Your Appointment"
            : "Confirm Your Wellness Appointment"
        }
        description={
          confirmationMode === "login" ? (
            <>
              You’ve selected a time slot for your Wellness Appointment.
              Please <strong>log in</strong> to your account to continue and
              confirm your booking.
            </>
          ) : (
            <>
              {pendingChip
                ? `${dayLabel(pendingChip.date)}, ${pendingChip.startTime} – ${pendingChip.finishTime}. `
                : ""}
              If you have an active membership plan, this appointment will be
              booked using your plan. Otherwise you’ll be redirected to{" "}
              <strong>Stripe</strong> to complete your payment.
            </>
          )
        }
        confirmText={confirmationMode === "login" ? "Log In" : "Confirm"}
        cancelText="Cancel"
      />

      <CustomConfirmationModal
        theme="dark"
        isOpen={paidModalType !== null}
        onClose={clearPendingBooking}
        onConfirm={() => void submitBooking(true)}
        isPending={isPending}
        title={
          paidModalType === "BREATHWORK_LIMIT_REACHED"
            ? "Breathwork Sessions Used"
            : "Plan Treatments Used"
        }
        description={
          paidModalType === "BREATHWORK_LIMIT_REACHED"
            ? "You have used all Breathwork sessions included in your plan this month. Would you like to book a single paid appointment?"
            : "You have used all treatments in your current plan this month. Would you like to book a single paid appointment?"
        }
        confirmText="Yes"
        cancelText="No"
      />
    </main>
  );
}
