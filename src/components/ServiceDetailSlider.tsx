"use client";

import { useEffect, useRef, useState } from "react";
import ServiceDetailCard from "./ServiceDetailCard";

interface ServiceDetailSliderProp {
  is_dentistry: boolean;
  removeCentering?: boolean;

  services: Array<{ title: string; description: string | null; path: string }>;
}

export default function ServiceDetailSlider({
  services,
  removeCentering,
}: ServiceDetailSliderProp) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [thumbWidth, setThumbWidth] = useState(0);
  const [scrollThumbOffset, setScrollThumbOffset] = useState(0);
  const [containerWidth, setContainerWidth] = useState(0);
  const [scrollbarWidth, setScrollbarWidth] = useState(700);

  useEffect(() => {
    const container = containerRef.current;

    if (container) {
      const updateDimensions = () => {
        const screenWidth = window.innerWidth;

        if (screenWidth >= 768) {
          setContainerWidth(3 * 562 + 2 * 40);
          setScrollbarWidth(700);
        } else {
          setContainerWidth(562);
          setScrollbarWidth(200);
        }

        // Update thumb size
        const visibleWidth = container.clientWidth;
        const totalWidth = container.scrollWidth;
        const thumbSize = (visibleWidth / totalWidth) * scrollbarWidth;

        setThumbWidth(Math.max(thumbSize, 50));
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

      const thumbOffset =
        (scrollLeft / maxScrollLeft) * (scrollbarWidth - thumbWidth);
      setScrollThumbOffset(Math.min(thumbOffset, scrollbarWidth - thumbWidth));
    }
  };

  return (
    <div className="w-full flex flex-col gap-4 md:gap-[3rem]">
      {/* Cards Container */}
      <div
        className="flex gap-[40px] overflow-x-auto scrollbar-hide w-full"
        ref={containerRef}
        onScroll={handleContainerScroll}
        style={{ maxWidth: `${containerWidth}px` }}
      >
        {services.map((service, index) => (
          <ServiceDetailCard
            key={index}
            title={service.title}
            description={service.description}
            path={service.path}
            buttonText={"Learn More"}
            card_height={723}
            className="w-[350px] h-[full] md:w-[562px] md:h-[723px]"
          />
        ))}
      </div>

      <div
        className={`relative h-3 bg-[#F1F5F9] rounded-full ${
          removeCentering ? "" : "mx-auto"
        } overflow-hidden`}
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
