"use client";

import { TPlan } from "@/types/common";
import Card from "../components/Card";
import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react"; // You can use any icon library
import PageTopBar from "@/app/(dashboards)/components/custom-components/PageTopBar";

const PLANS: TPlan[] = [
  {
    id: "plan1",
    title: "Plan 01",
    name: "Basic Dental Care",
    price: "50/month",
    target: "Individuals",
    services: [
      "1 routine check-up every 6 months",
      "Basic cleaning",
      "X-rays once a year",
      "Emergency consultation discounts",
    ],
    type: "Plan",
  },
  {
    id: "plan2",
    title: "Plan 02",
    name: "Family Dental Plan",
    price: "120/month",
    target: "Families (up to 4 members)",
    services: [
      "2 check-ups per person annually",
      "2 cleanings per person annually",
      "Fluoride treatment for children",
      "15% discount on orthodontics",
    ],
    type: "Plan",
  },
  {
    id: "plan3",
    title: "Plan 03",
    name: "Cosmetic Care Plan",
    price: "200/month",
    target: "Adults seeking aesthetic treatments",
    services: [
      "Whitening session every 6 months",
      "Routine cleaning and polishing",
      "Discounts on veneers and crowns",
      "Consultation for smile design",
    ],
    type: "Plan",
  },
];

export default function PlansPage() {
  const [, setWidth] = useState<number | null>(null);
  const [currentIndex, setCurrentIndex] = useState(1); // Start with middle card
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    const handleResize = () => setWidth(window.innerWidth);
    handleResize();
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const nextCard = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setCurrentIndex((prev) => (prev + 1) % PLANS.length);
    setTimeout(() => setIsAnimating(false), 300);
  };

  const prevCard = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setCurrentIndex((prev) => (prev - 1 + PLANS.length) % PLANS.length);
    setTimeout(() => setIsAnimating(false), 300);
  };

  const getCardPosition = (index: number) => {
    const positions = ["left", "center", "right"];
    const relativeIndex = (index - currentIndex + PLANS.length) % PLANS.length;
    return positions[relativeIndex] || "right";
  };

  const getCardStyle = (position: string) => {
    switch (position) {
      case "center":
        return {
          transform: "scale(1)",
          opacity: 1,
          filter: "blur(0px)",
          zIndex: 10,
        };
      case "left":
        return {
          transform: "scale(0.85) translateX(-100%)",
          opacity: 0.6,
          filter: "blur(2px)",
          zIndex: 1,
        };
      case "right":
        return {
          transform: "scale(0.85) translateX(100%)",
          opacity: 0.6,
          filter: "blur(2px)",
          zIndex: 1,
        };
      default:
        return {};
    }
  };

  return (
    <div className="w-full h-full flex flex-col gap-7">
      <PageTopBar
        statusOptions={[]}
        pageHeading="Plans & Subscriptions"
        showFilters={false}
        showSearch={false}
      />
      <div className="flex flex-col px-6 py-10 gap-10 rounded-2xl bg-dashboardBarBackground">
        <p className="text-center text-green font-semibold text-[27px]">
          Clear and Fair Pricing for Everyone
        </p>

        {/* Card Carousel Container */}
        <div className="relative w-full max-w-[1500px] overflow-x-hidden mx-auto">
          {/* Navigation Buttons */}
          <button
            onClick={prevCard}
            disabled={isAnimating}
            className="absolute left-4 top-1/2 transform -translate-y-1/2 z-20 bg-white rounded-full p-3 shadow-lg hover:bg-gray-50 disabled:opacity-50 transition-all duration-200"
          >
            <ChevronLeft size={24} className="text-green" />
          </button>

          <button
            onClick={nextCard}
            disabled={isAnimating}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 z-20 bg-white rounded-full p-3 shadow-lg hover:bg-gray-50 disabled:opacity-50 transition-all duration-200"
          >
            <ChevronRight size={24} className="text-green" />
          </button>

          {/* Cards Container */}
          <div className="relative h-[700px] flex items-start justify-center">
            {PLANS.map((plan, index) => {
              const position = getCardPosition(index);
              const style = getCardStyle(position);
              const isCenter = position === "center";

              return (
                <div
                  key={plan.id}
                  className="absolute transition-all duration-300 ease-in-out"
                  style={style}
                >
                  <Card
                    type="clinic"
                    plan={plan}
                    backgroundColor={isCenter ? "#f3f5f7" : "#ffffff"}
                    borderColor={isCenter ? "#b7a58d" : "#f3f5f7"}
                    classname={isCenter ? "" : "cursor-pointer"}
                  />
                </div>
              );
            })}
          </div>

          {/* Dot Indicators
          <div className="flex justify-center mt-8 space-x-3">
            {PLANS.map((_, index) => (
              <button
                key={index}
                onClick={() => {
                  if (!isAnimating) {
                    setIsAnimating(true);
                    setCurrentIndex(index);
                    setTimeout(() => setIsAnimating(false), 300);
                  }
                }}
                className={`w-3 h-3 rounded-full transition-all duration-200 ${
                  index === currentIndex
                    ? "bg-green"
                    : "bg-gray-300 hover:bg-gray-400"
                }`}
              />
            ))}
          </div> */}
        </div>
      </div>
    </div>
  );
}
