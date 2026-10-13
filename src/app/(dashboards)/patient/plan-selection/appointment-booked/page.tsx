import Link from "next/link";
import { CheckCircle2 } from "lucide-react";
import { formatInTimeZone } from "date-fns-tz";
import { getTreatments } from "@/services/wellnessTreatments/wellnessTreatmentQuery";
import { TTreatment } from "@/types/common";

const TIMEZONE = "Europe/London";

interface AppointmentBookedPageProps {
  searchParams?: Promise<{
    appointmentId?: string;
    treatmentId?: string;
    startTime?: string;
    finishTime?: string;
    remaining?: string;
    remainingHyperbaric?: string;
  }>;
}

export default async function AppointmentBookedPage({
  searchParams,
}: AppointmentBookedPageProps) {
  const params: {
    appointmentId?: string;
    treatmentId?: string;
    startTime?: string;
    finishTime?: string;
    remaining?: string;
    remainingHyperbaric?: string;
  } = (await searchParams) ?? {};

  const treatmentId = params.treatmentId
    ? Number(params.treatmentId)
    : undefined;
  const remaining = params.remaining;
  const remainingHyperbaric = params.remainingHyperbaric;

  let treatmentName: string | null = null;

  if (treatmentId) {
    const treatmentsResponse = await getTreatments();

    const treatments: TTreatment[] =
      treatmentsResponse &&
      "status" in treatmentsResponse &&
      treatmentsResponse.status &&
      Array.isArray(treatmentsResponse.data)
        ? (treatmentsResponse.data as TTreatment[])
        : [];

    treatmentName =
      treatments.find(
        (treatment) => Number(treatment.id) === treatmentId,
      )?.name ?? null;
  }

  const slotLabel = params.startTime
    ? formatInTimeZone(
        new Date(params.startTime),
        TIMEZONE,
        "EEEE, dd MMMM yyyy 'at' HH:mm",
      )
    : null;

  const remainingLabel =
    remaining === "unlimited" || remaining === "null"
      ? "Unlimited treatments remaining on your plan"
      : remaining && !Number.isNaN(Number(remaining))
        ? `${remaining} treatment${Number(remaining) === 1 ? "" : "s"} remaining on your plan`
        : null;

  const remainingHyperbaricLabel =
    remainingHyperbaric === "unlimited" || remainingHyperbaric === "null"
      ? "Unlimited Hyperbaric sessions remaining on your plan"
      : remainingHyperbaric &&
        !Number.isNaN(Number(remainingHyperbaric))
        ? `${remainingHyperbaric} Hyperbaric session${
            Number(remainingHyperbaric) === 1 ? "" : "s"
          } remaining on your plan`
        : null;

  return (
    <div className="relative min-h-screen bg-[#0B0A08]">
      <div
        aria-hidden
        className="pointer-events-none absolute left-[-250px] top-0 h-[750px] w-[1100px] bg-[radial-gradient(ellipse_at_center,rgba(214,188,160,0.18)_0%,rgba(255,255,255,0)_65%)]"
      />

      <div className="relative mx-auto flex min-h-screen w-full max-w-[1000px] items-center justify-center px-4 py-20 sm:px-6 lg:px-8">
        <section className="w-full max-w-[650px]">
          <div className="rounded-[28px] border border-[#56493A]/45 bg-[#12100D]/[0.82] px-6 py-10 text-center shadow-[0_30px_50px_-20px_rgba(0,0,0,0.35)] sm:px-8 sm:py-12">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/15">
              <CheckCircle2
                className="h-9 w-9 text-emerald-400"
                strokeWidth={1.5}
                aria-hidden="true"
              />
            </div>

            <h1 className="mt-6 font-[family-name:var(--font-cormorant)] text-[34px] font-normal leading-[40px] tracking-[-0.5px] text-[var(--wt-heading)] sm:text-[46px] sm:leading-[50px]">
              Appointment Booked Successfully
            </h1>

            <div className="mt-6 space-y-2 font-gillSans text-base leading-7 text-[var(--wt-desc)] sm:text-lg">
              {treatmentName && <p>Treatment: {treatmentName}</p>}
              {slotLabel && <p>{slotLabel}</p>}
              {params.appointmentId && (
                <p className="text-sm text-[var(--wt-desc)]/70">
                  Reference: {params.appointmentId}
                </p>
              )}
            </div>

            {(remainingLabel || remainingHyperbaricLabel) && (
              <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
                {remainingLabel && (
                  <p className="inline-flex items-center gap-2 rounded-full border border-emerald-300/30 bg-emerald-500/10 px-4 py-2 font-gillSans text-sm font-medium text-emerald-300">
                    <span
                      aria-hidden
                      className="h-1.5 w-1.5 rounded-full bg-emerald-400"
                    />
                    {remainingLabel}
                  </p>
                )}

                {remainingHyperbaricLabel && (
                  <p className="inline-flex items-center gap-2 rounded-full border border-cyan-300/30 bg-cyan-500/10 px-4 py-2 font-gillSans text-sm font-medium text-cyan-300">
                    <span
                      aria-hidden
                      className="h-1.5 w-1.5 rounded-full bg-cyan-400"
                    />
                    {remainingHyperbaricLabel}
                  </p>
                )}
              </div>
            )}

            <div className="mt-8 h-px w-full bg-white/10" />

            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
              <Link
                href="/patient/plan-selection/wellness-treatments"
                className="inline-flex h-9 w-full items-center justify-center rounded-full bg-[var(--wt-btn)] px-6 py-[10px] font-gillSans text-sm font-medium uppercase tracking-wide text-[#0b0a08] transition hover:opacity-90 sm:w-auto"
              >
                Book Another Treatment
              </Link>

              <Link
                href="/patient/appointments/upcoming"
                className="inline-flex h-9 w-full items-center justify-center rounded-full border border-white/15 bg-white/5 px-6 py-[10px] font-gillSans text-sm font-medium uppercase tracking-wide text-[var(--wt-name)] transition hover:bg-white/10 sm:w-auto"
              >
                View Appointments
              </Link>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}