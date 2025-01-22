import { TeethCartoon } from "@/assets";
import PlanCard from "./PlanCard";

export default function PricingPlans() {
  const PLAN_DATA = [
    {
      title: "Basic Care Plan",
      description: "Essential health services for individuals.",
      price: "$0 / month",
      features: [
        "Basic consultation",
        "Access to general practitioners",
        "Health tips and updates",
        "Limited appointment slots",
      ],
      isSubscribed: false,
      path: "/subscribe/basic",
      buttonText: "Select",
      backgroundContent: TeethCartoon,
    },
    {
      title: "Standard Care Plan",
      description: "Comprehensive care for regular health needs.",
      price: "$25 / month",
      features: [
        "Access to all general practitioners",
        "Priority appointment scheduling",
        "Monthly health check-ups",
        "Discount on lab tests and medicines",
        "Personalized health advice",
      ],
      isSubscribed: false,
      path: "/subscribe/standard",
      buttonText: "Subscribe",
      backgroundContent: TeethCartoon,
    },
    {
      title: "Premium Care Plan",
      description: "Advanced health services tailored for families.",
      price: "$50 / month",
      features: [
        "All Standard Care features",
        "24/7 telemedicine support",
        "Family plan (up to 4 members)",
        "Specialist consultations",
        "Wellness and fitness programs",
        "Dedicated care manager",
      ],
      isSubscribed: true, // Example: User has already subscribed
      path: "/subscribe/premium",
      buttonText: "Select",
      backgroundContent: TeethCartoon,
    },
  ];

  return (
    <div className="zoom-out flex flex-col gap-20 w-full min-h-screen mx-auto bg-feeGuide">
      <h2 className=" text-[40px] font-opus md:text-[52px] mx-auto container text-center font-normal pt-[3.5rem]">
        Choose Your Plan
      </h2>
      <div className=" grid grid-cols-1 justify-items-center gap-[3rem] container lg:gap-16 lg:grid-cols-2 xl:grid-cols-3 mx-auto h-full pb-[10%] lg:px-12">
        {PLAN_DATA.map((plan, index) => (
          <PlanCard
            key={index}
            title={plan.title}
            description={plan.description}
            price={plan.price}
            features={plan.features}
            isSubscribed={plan.isSubscribed}
            path={plan.path}
            buttonText={plan.buttonText}
            backgroundContent={plan.backgroundContent}
          />
        ))}
      </div>
    </div>
  );
}
