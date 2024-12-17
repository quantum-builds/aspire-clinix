"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import ServiceDetailCard from "./ServiceDetailCard";

interface ServiceDetailSliderProp {
  card_width?: number;
  is_dentistry: boolean;
  services: Array<{ title: string; description: string | null; path: string }>;
}

export default function ServiceDetailSlider({
  services,
  is_dentistry,
  card_width,
}: ServiceDetailSliderProp) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const scrollThumbRef = useRef<HTMLDivElement | null>(null);
  const [customScrollbarWidth, setCustomScrollbarWidth] = useState(0);
  const [thumbWidth, setThumbWidth] = useState(0);
  const [scrollThumbOffset, setScrollThumbOffset] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const dragStartX = useRef(0);
  const scrollStartLeft = useRef(0);

  useEffect(() => {
    const container = containerRef.current;

    if (container) {
      const updateThumbSize = () => {
        setCustomScrollbarWidth(container.clientWidth);
        setThumbWidth(
          (container.clientWidth / container.scrollWidth) *
            container.clientWidth
        );
      };

      updateThumbSize();
      window.addEventListener("resize", updateThumbSize);

      return () => window.removeEventListener("resize", updateThumbSize);
    }
  }, []);

  const handleContainerScroll = () => {
    const container = containerRef.current;

    if (container) {
      const scrollPercentage =
        container.scrollLeft / (container.scrollWidth - container.clientWidth);
      console.log(`scrollPercentage ${scrollPercentage}`);
      setScrollThumbOffset(
        scrollPercentage * (customScrollbarWidth - thumbWidth)
      );
    }
  };

  useEffect(() => {
    console.log(`thumbWidht ${thumbWidth}`);
  }, [thumbWidth]);

  const handleThumbMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsDragging(true);
    dragStartX.current = e.clientX;
    scrollStartLeft.current = scrollThumbOffset;
  };

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!isDragging || !containerRef.current) return;

      const container = containerRef.current;
      const dragDistance = e.clientX - dragStartX.current;
      const newOffset = Math.min(
        Math.max(scrollStartLeft.current + dragDistance, 0),
        customScrollbarWidth - thumbWidth
      );

      setScrollThumbOffset(newOffset);

      const scrollPercentage = newOffset / (customScrollbarWidth - thumbWidth);
      container.scrollLeft =
        scrollPercentage * (container.scrollWidth - container.clientWidth);
    },
    [isDragging, customScrollbarWidth, thumbWidth]
  );

  const handleMouseUp = () => setIsDragging(false);

  useEffect(() => {
    if (isDragging) {
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);
    } else {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    }

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isDragging, handleMouseMove]);

  return (
    <div className="w-full h-full flex flex-col gap-2 md:gap-[40px]">
      <div
        className="flex gap-2 md:gap-[60px] overflow-x-auto whitespace-nowrap w-full h-full scrollbar-hide"
        onScroll={handleContainerScroll}
        ref={containerRef}
      >
        {services.map((service, index) => (
          <ServiceDetailCard
            key={index}
            title={service.title}
            description={service.description}
            path={service.path}
            card_width={card_width}
            buttonText={"Learn More"}
          />
        ))}
      </div>

      <div
        className={`h-3 bg-gray-200 rounded-full ${
          is_dentistry ? "mx-auto w-[50%]" : "w-full"
        }`}
      >
        <div
          ref={scrollThumbRef}
          className="h-full bg-black rounded-full cursor-pointer"
          style={{
            width: `${thumbWidth}px`,
            transform: `translateX(${scrollThumbOffset}px)`,
          }}
          onMouseDown={handleThumbMouseDown}
        ></div>
      </div>
    </div>
  );
}
