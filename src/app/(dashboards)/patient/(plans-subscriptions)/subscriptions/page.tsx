import { TPlan } from "@/types/common";
import Card from "../components/Card";

const PLANS: TPlan[] = [
  {
    id: "plan1",
    title: "Basic",
    name: "Basic Dental Care",
    price: "50/month",
    target: "Individuals",
    services: [
      "1 routine check-up every 6 months",
      "Basic cleaning",
      "X-rays once a year",
      "Emergency consultation discounts",
    ],
  },
  {
    id: "plan2",
    title: "Premium",
    name: "Family Dental Plan",
    price: "120/month",
    target: "Families (up to 4 members)",
    services: [
      "2 check-ups per person annually",
      "2 cleanings per person annually",
      "Fluoride treatment for children",
      "15% discount on orthodontics",
    ],
  },
  {
    id: "plan3",
    title: "Comprehensive",
    name: "Cosmetic Care Plan",
    price: "200/month",
    target: "Adults seeking aesthetic treatments",
    services: [
      "Whitening session every 6 months",
      "Routine cleaning and polishing",
      "Discounts on veneers and crowns",
      "Consultation for smile design",
    ],
  },
];

export default function SubscriptionPage() {
  return (
    <div className=" w-full h-full flex flex-col gap-7">
      <h1 className="font-medium text-3xl">Plans & Subscriptions</h1>
      <div className="flex flex-col gap-16 px-6 py-[60px] rounded-2xl bg-dashboardBarBackground ">
        <p className="text-center text-green font-medium text-[32px]">
          Clear and Fair Pricing for Everyone
        </p>
        <div className="w-full grid grid-cols-3 gap-6 ">
          {PLANS.map((plan, index) => (
            <Card
              plan={plan}
              key={index}
              backgroundColor={index % 2 === 1 ? "#f3f5f7" : "#ffffff"}
              borderColor={index % 2 === 1 ? "#54bd95" : "#f3f5f7"}
              classname={index % 2 === 1 ? "" : "mt-10"}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
