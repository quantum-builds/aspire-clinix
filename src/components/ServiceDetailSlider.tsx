"use client";

import { useEffect, useRef, useState } from "react";
import ServiceDetailCard from "./ServiceDetailCard";

interface ServiceDetailSliderProp {
  is_dentistry: boolean;
  services: Array<{ title: string; description: string | null; path: string }>;
}

export default function ServiceDetailSlider({
  services,
}: // is_dentistry,
ServiceDetailSliderProp) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [thumbWidth, setThumbWidth] = useState(0);
  const [scrollThumbOffset, setScrollThumbOffset] = useState(0);
  const [containerWidth, setContainerWidth] = useState(0);
  const [scrollbarWidth, setScrollbarWidth] = useState(548); // Default scrollbar width for md screens

  useEffect(() => {
    const container = containerRef.current;

    if (container) {
      const updateDimensions = () => {
        const screenWidth = window.innerWidth;
        // Adjust container width for responsive behavior
        if (screenWidth >= 768) {
          setContainerWidth(3 * 562 + 2 * 40); // 3 cards + gaps
          setScrollbarWidth(548); // md breakpoint scrollbar width
        } else {
          setContainerWidth(562); // 1 card width for smaller screens
          setScrollbarWidth(200); // Smaller scrollbar width
        }

        // Update thumb size
        const visibleWidth = container.clientWidth;
        const totalWidth = container.scrollWidth;
        const thumbSize = (visibleWidth / totalWidth) * scrollbarWidth;

        setThumbWidth(Math.max(thumbSize, 50)); // Minimum thumb width
      };

      updateDimensions();
      window.addEventListener("resize", updateDimensions);

      return () => window.removeEventListener("resize", updateDimensions);
    }
  }, [services]);

  const handleContainerScroll = () => {
    const container = containerRef.current;

    if (container) {
      const scrollLeft = container.scrollLeft;
      const maxScrollLeft = container.scrollWidth - container.clientWidth;

      // Calculate scrollbar thumb position within the visible scrollbar width
      const thumbOffset =
        (scrollLeft / maxScrollLeft) * (scrollbarWidth - thumbWidth);
      setScrollThumbOffset(Math.min(thumbOffset, scrollbarWidth - thumbWidth));
    }
  };

  return (
    <div className="w-full flex flex-col gap-4">
      {/* Cards Container */}
      <div
        className="flex gap-[40px] overflow-x-auto scrollbar-hide w-full"
        ref={containerRef}
        onScroll={handleContainerScroll}
        style={{ maxWidth: `${containerWidth}px` }} // Set max width based on screen size
      >
        {services.map((service, index) => (
          <ServiceDetailCard
            key={index}
            title={service.title}
            description={service.description}
            path={service.path}
            buttonText={"Learn More"}
            card_height={723}
            className="w-[562px] h-[723px]"
          />
        ))}
      </div>

      {/* Custom Scrollbar */}
      <div
        className={`relative h-3 bg-[#F1F5F9] rounded-full mx-auto overflow-hidden`}
        style={{ width: `${scrollbarWidth}px`, marginTop: "1rem" }}
      >
        <div
          className="absolute h-full bg-black rounded-full"
          style={{
            width: `${thumbWidth}px`,
            transform: `translateX(${scrollThumbOffset}px)`,
            transition: "transform 0.1s ease",
          }}
        />
      </div>
    </div>
  );
}
