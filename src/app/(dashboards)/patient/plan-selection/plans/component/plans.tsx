import Button from "@/app/(dashboards)/components/Button";

const MEMBERSHIP_PLANS = [
  {
    name: "Essentials",
    price: "£275",
    features: [
      "Any 4 treatments per month (up to 2 hyperbaric)",
      "VIP access to special events, including 1 guest pass",
      "1 complimentary breathwork session",
    ],
  },
  {
    name: "Perform",
    price: "£445",
    features: [
      "Any 8 treatments per month (up to 4 hyperbaric)",
      "VIP access to special events, including 2 guest passes",
      "2 complimentary breathwork sessions",
    ],
  },
  {
    name: "Unlimited",
    price: "£785",
    features: [
      "Unlimited treatments, with up to 8 hyperbaric sessions per month",
      "VIP access to special events, including 3 guest passes",
      "3 complimentary breathwork sessions",
    ],
  },
];

export default function PlansPage() {
  return (
    <main className="min-h-screen  px-4 py-2 sm:px-6 lg:px-8">
      <div className="mx-auto flex min-h-[calc(100vh-6rem)] w-full max-w-4xl items-center justify-center">
        <section className="w-full rounded-2xl bg-dashboardBarBackground px-6 py-10 text-center shadow-sm sm:px-10 md:py-14">
          <div className="mx-auto max-w-2xl">
            <h1 className="font-opus text-3xl font-medium text-dashboardTextBlack sm:text-4xl">
              Membership Plans
            </h1>
            <p className="mx-auto mt-4 max-w-xl font-gillSans text-lg text-lightBlack sm:text-xl">
              Choose the membership plan that fits your wellness journey.
            </p>
          </div>

          <div className="mx-auto mt-10 grid max-w-[650px] gap-5 sm:grid-cols-1">
            {MEMBERSHIP_PLANS.map((plan) => (
              <div
                key={plan.name}
                className="rounded-2xl border px-5 py-6 text-left border-green transition hover:border-green-600"
              >
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <h2 className="font-opus text-2xl font-medium text-dashboardTextBlack">
                    {plan.name}
                  </h2>

                  <p className="flex items-baseline gap-1">
                    <span className="text-green font-semibold text-2xl">
                      {plan.price}
                    </span>
                    <span className="font-gillSans text-base text-lightBlack">
                      / month
                    </span>
                  </p>
                </div>

                <ul className="list-disc pl-5 font-gillSans text-base text-lightBlack">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="mt-2">
                      {feature}
                    </li>
                  ))}
                </ul>

                <Button
                  text="Buy"
                  className="ml-auto mt-5 h-10 px-5 py-0 text-base"
                />
              </div>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
