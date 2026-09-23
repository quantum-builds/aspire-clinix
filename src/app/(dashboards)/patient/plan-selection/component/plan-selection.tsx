import { ArrowRight } from "lucide-react";
import Link from "next/link";

const PLAN_OPTIONS: { title: string; description: string; href?: string }[] = [
  {
    title: "Current Plan",
    description: "You already have a purchased plan — view or manage it.",
  },
  {
    title: "Need to Buy a Plan",
    description: "Purchase a plan to continue.",
    href: "/patient/plan-selection/plans",
  },
  {
    title: "No Current Plan",
    description: "Book a wellness appointment without purchasing a plan.",
  },
];

export default function PlanSelectionPage() {
  return (
  <main className="min-h-screen  px-4 py-2 sm:px-6 lg:px-8">
      <div className="mx-auto flex min-h-[calc(100vh-6rem)] w-full max-w-4xl items-center justify-center">
        <section className="w-full rounded-2xl bg-dashboardBarBackground px-6 py-10 text-center shadow-sm sm:px-10 md:py-14">
          <div className="mx-auto max-w-2xl">
            <h1 className="font-opus text-3xl font-medium text-dashboardTextBlack sm:text-4xl">
              Plan Selection
            </h1>
            <p className="mx-auto mt-4 max-w-xl font-gillSans text-lg text-lightBlack sm:text-xl">
              Choose how you would like to continue with your Wellness
              appointment.
            </p>
          </div>

          <div className="mx-auto mt-10 grid max-w-[650px] gap-5 sm:grid-cols-1">
            {PLAN_OPTIONS.map((option) => {
              const cardClassName =
                "flex cursor-pointer flex-col items-start gap-5 rounded-2xl border px-5 py-3 border-green transition hover:border-green-600";

              const cardContent = (
                <div>
                  <h2 className="flex items-center gap-2 font-opus text-2xl font-medium text-dashboardTextBlack">
                    {option.title}
                    <ArrowRight size={24} />
                  </h2>

                  <p className="mt-2 font-gillSans text-base text-lightBlack">
                    {option.description}
                  </p>
                </div>
              );

              if (option.href) {
                return (
                  <Link
                    key={option.title}
                    href={option.href}
                    className={cardClassName}
                  >
                    {cardContent}
                  </Link>
                );
              }

              return (
                <div key={option.title} className={cardClassName}>
                  {cardContent}
                </div>
              );
            })}
          </div>
        </section>
      </div>
    </main>
  );
}
