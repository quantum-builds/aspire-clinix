import Link from "next/link";
import {
  BadgeCheck,
  CalendarDays,
  ChevronRight,
  Clock,
  Info,
  Lock,
  MapPin,
  Star,
} from "lucide-react";
import { ReactNode } from "react";

// How the appointment will be paid for:
// - "stripe": single paid appointment (redirect to Stripe)
// - "plan": booked using the membership plan
// - "plan-or-stripe": plan if the patient has one, otherwise Stripe
export type BookingPaymentMode = "stripe" | "plan" | "plan-or-stripe";

interface BookingSummaryProps {
  date: string;
  time: string;
  durationMinutes?: number | null;
  serviceName?: string | null;
  price?: string | number | null;
  mode: BookingPaymentMode;
  // Optional message shown above the payment note (e.g. plan limit reached).
  notice?: ReactNode;
  // Membership upsell link; defaults to on for "stripe" only.
  showUpsell?: boolean;
}

function formatDuration(minutes?: number | null) {
  if (!minutes || minutes <= 0) return null;
  if (minutes >= 60 && minutes % 60 === 0) return `${minutes / 60} hr`;
  return `${minutes} min`;
}

function SummaryRow({
  icon,
  label,
  value,
  extra,
}: {
  icon: ReactNode;
  label: string;
  value: ReactNode;
  extra?: ReactNode;
}) {
  return (
    <div className="flex items-center gap-3.5 border-t border-[#3A312A] py-3.5 first:border-t-0">
      <span className="shrink-0 text-[#C9BBA6]">{icon}</span>
      <dt className="w-16 shrink-0 text-sm text-[#B5A99A]">{label}</dt>
      <dd className="min-w-0 text-base font-medium text-[#F2EBE0]">{value}</dd>
      {extra && (
        <dd className="ml-auto shrink-0 text-sm text-[#B5A99A]">{extra}</dd>
      )}
    </div>
  );
}

function Note({ icon, children }: { icon: ReactNode; children: ReactNode }) {
  return (
    <div className="flex items-start gap-3">
      <span className="mt-0.5 shrink-0 text-[#C9BBA6]">{icon}</span>
      <p className="m-0 text-sm leading-[1.55] text-[#C9BDAE] [&_strong]:font-medium [&_strong]:text-[#F2EBE0]">
        {children}
      </p>
    </div>
  );
}

// Body of the wellness booking confirmation modals.
export default function BookingSummary({
  date,
  time,
  durationMinutes,
  serviceName,
  price,
  mode,
  notice,
  showUpsell = mode === "stripe",
}: BookingSummaryProps) {
  const duration = formatDuration(durationMinutes);
  const iconProps = { className: "h-5 w-5", strokeWidth: 1.6 };
  const noteIconProps = { className: "h-[18px] w-[18px]", strokeWidth: 1.6 };
  const hasPrice = price !== null && price !== undefined && price !== "";

  return (
    <div className="flex flex-col gap-6 font-gillSans">
      <dl className="m-0 rounded-[14px] border border-[#3A312A] bg-[#241E1A] px-4 py-1 sm:px-5 sm:py-1.5">
        <SummaryRow
          icon={<CalendarDays {...iconProps} />}
          label="Date"
          value={date}
        />
        <SummaryRow
          icon={<Clock {...iconProps} />}
          label="Time"
          value={time}
          extra={duration}
        />
        {serviceName && (
          <SummaryRow
            icon={<MapPin {...iconProps} />}
            label="Service"
            value={serviceName}
            extra={
              hasPrice && mode !== "plan" ? (
                <span className="text-base font-medium text-[#F2EBE0]">
                  £{price}
                </span>
              ) : null
            }
          />
        )}
      </dl>

      {notice && <Note icon={<Info {...noteIconProps} />}>{notice}</Note>}

      {mode === "stripe" && (
        <Note icon={<Lock {...noteIconProps} />}>
          You&apos;ll be redirected to <strong>Stripe</strong> to complete your
          payment securely.
        </Note>
      )}

      {mode === "plan" && (
        <Note icon={<BadgeCheck {...noteIconProps} />}>
          This appointment will be booked using your{" "}
          <strong>membership plan</strong>.
        </Note>
      )}

      {mode === "plan-or-stripe" && (
        <Note icon={<Lock {...noteIconProps} />}>
          If you have an active membership plan, this appointment will be
          booked using your plan. Otherwise you&apos;ll be redirected to{" "}
          <strong>Stripe</strong> to complete your payment securely.
        </Note>
      )}

      {showUpsell && (
        <Link
          href="/patient/plan-selection/plans"
          className="group flex items-center gap-3 rounded-xl bg-[#352D27] px-4 py-3.5 no-underline transition-colors hover:bg-[#3E352E]"
        >
          <Star
            className="h-[18px] w-[18px] shrink-0 text-[#E8DCC8]"
            strokeWidth={1.6}
          />
          <span className="flex-1 text-sm leading-[1.4] text-[#C9BDAE]">
            <b className="font-medium text-[#F2EBE0]">
              Get plan pricing on your Wellness appointments by purchasing a membership plan.
            </b>{" "}
            See membership plans
          </span>
          <ChevronRight
            className="h-4 w-4 shrink-0 text-[#C9BDAE] transition-transform group-hover:translate-x-[3px]"
            strokeWidth={1.8}
          />
        </Link>
      )}
    </div>
  );
}
