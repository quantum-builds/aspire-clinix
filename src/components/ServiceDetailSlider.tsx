"use client";

import { useCallback, useLayoutEffect, useRef, useState } from "react";
import ServiceDetailCard from "./ServiceDetailCard";
import clsx from "clsx";
import { StaticImageData } from "next/image";

interface ServiceDetailSliderProp {
  is_dentistry: boolean;
  className?: string;
  scrollbarWidthOverride?: number;

  services: Array<{
    title: string;
    description: string | null;
    path: string;
    backgroundContent: string | StaticImageData;
  }>;
}

export default function ServiceDetailSlider({
  services,
  className,
}: ServiceDetailSliderProp) {
  const isDragging = useRef(false);
  const scrollbarRef = useRef<HTMLDivElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [thumbWidth, setThumbWidth] = useState(0);
  const [scrollThumbOffset, setScrollThumbOffset] = useState(0);
  const [containerWidth, setContainerWidth] = useState(0);
  const [scrollbarWidth, setScrollbarWidth] = useState(848);
  const startDragX = useRef(0);
  const [loadedImages, setLoadedImages] = useState(0);

  useLayoutEffect(() => {
    if (loadedImages === services.length) {
      const container = containerRef.current;
      if (container) {
        const updateDimensions = () => {
          const screenWidth = window.innerWidth;
          if (screenWidth >= 1536) {
            setScrollbarWidth(848);
            setContainerWidth(3 * 562 + 2 * 40);
          } else if (screenWidth >= 1280) {
            setScrollbarWidth(600);
            setContainerWidth(3 * 562 + 2 * 40);
          } else if (screenWidth >= 1024) {
            setContainerWidth(3 * 562 + 2 * 40);
            setScrollbarWidth(470);
          } else if (screenWidth >= 768) {
            setContainerWidth(3 * 562 + 2 * 40);
            setScrollbarWidth(340);
          } else {
            setContainerWidth(562);
            setScrollbarWidth(310);
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
    }
  }, [loadedImages, scrollbarWidth, services]);
  const handleImageLoad = () => {
    setLoadedImages((prev) => prev + 1); // Increment the counter
  };
  useLayoutEffect(() => {
    handleContainerScroll(); // Force initial thumb synchronization

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scrollbarWidth, thumbWidth, services]);

  const handleContainerScroll = useCallback(() => {
    const container = containerRef.current;

    if (container) {
      const scrollLeft = container.scrollLeft;
      const maxScrollLeft = container.scrollWidth - container.clientWidth;

      const thumbOffset =
        (scrollLeft / maxScrollLeft) * (scrollbarWidth - thumbWidth);
      setScrollThumbOffset(Math.min(thumbOffset, scrollbarWidth - thumbWidth));
    }
  }, [scrollbarWidth, thumbWidth]);
  useLayoutEffect(() => {
    handleContainerScroll();
  }, [scrollbarWidth, thumbWidth, services, handleContainerScroll]);

  const handleScrollbarClick = (event: React.MouseEvent) => {
    const scrollbar = scrollbarRef.current;
    const container = containerRef.current;

    if (scrollbar && container) {
      const rect = scrollbar.getBoundingClientRect();
      const clickPosition = event.clientX - rect.left;
      const maxThumbOffset = scrollbarWidth - thumbWidth;

      // Calculate the corresponding scrollLeft for the container
      const scrollRatio = clickPosition / scrollbarWidth;
      const maxScrollLeft = container.scrollWidth - container.clientWidth;
      const newScrollLeft = scrollRatio * maxScrollLeft;

      container.scrollTo({ left: newScrollLeft, behavior: "smooth" });
      setScrollThumbOffset(
        Math.min(
          (newScrollLeft / maxScrollLeft) * maxThumbOffset,
          maxThumbOffset
        )
      );
    }
  };

  const handleThumbDragStart = (event: React.MouseEvent | React.TouchEvent) => {
    isDragging.current = true;
    startDragX.current =
      "clientX" in event
        ? (event as React.MouseEvent).clientX
        : (event as React.TouchEvent).touches[0].clientX;
    event.preventDefault();
  };

  const handleThumbDragMove = useCallback(
    (event: MouseEvent | TouchEvent) => {
      if (!isDragging.current) return;

      const scrollbar = scrollbarRef.current;
      const container = containerRef.current;

      if (scrollbar && container) {
        const clientX =
          event instanceof MouseEvent
            ? event.clientX
            : event.touches[0].clientX;
        const deltaX = clientX - startDragX.current;

        const maxThumbOffset = scrollbarWidth - thumbWidth;
        const newThumbOffset = Math.min(
          Math.max(0, scrollThumbOffset + deltaX),
          maxThumbOffset
        );

        const scrollRatio = newThumbOffset / maxThumbOffset;
        const maxScrollLeft = container.scrollWidth - container.clientWidth;

        container.scrollLeft = scrollRatio * maxScrollLeft;
        setScrollThumbOffset(newThumbOffset);

        startDragX.current = clientX; // Update for the next move
      }
    },
    [scrollThumbOffset, scrollbarWidth, thumbWidth]
  );

  const handleThumbDragEnd = () => {
    isDragging.current = false;
  };

  useLayoutEffect(() => {
    window.addEventListener("mousemove", handleThumbDragMove);
    window.addEventListener("mouseup", handleThumbDragEnd);
    window.addEventListener("touchmove", handleThumbDragMove);
    window.addEventListener("touchend", handleThumbDragEnd);

    return () => {
      window.removeEventListener("mousemove", handleThumbDragMove);
      window.removeEventListener("mouseup", handleThumbDragEnd);
      window.removeEventListener("touchmove", handleThumbDragMove);
      window.removeEventListener("touchend", handleThumbDragEnd);
    };
  }, [handleThumbDragMove]);

  return (
    <div className="w-full flex flex-col gap-4 md:gap-[3rem]">
      {/* Cards Container */}
      <div
        className="flex gap-[40px] overflow-x-auto scrollbar-hide w-full mx-auto"
        ref={containerRef}
        onScroll={handleContainerScroll} // Synchronize with the custom scrollbar
        style={{ maxWidth: `${containerWidth}px` }}
      >
        {services.map((service, index) => (
          <ServiceDetailCard
            key={index}
            title={service.title}
            description={service.description}
            backgroundContent={service.backgroundContent}
            path={service.path}
            buttonText={"Learn More"}
            card_height={723}
            className="w-[350px] h-[full] md:w-[562px] md:h-[723px]"
            onLoad={handleImageLoad}
          />
        ))}
      </div>

      {/* Custom Scrollbar */}
      <div
        className={clsx(
          "relative h-3 bg-[#F1F5F9] rounded-full overflow-hidden cursor-pointer",
          className
        )}
        style={{ width: `${scrollbarWidth}px`, marginTop: "1rem" }}
        onClick={handleScrollbarClick} // Handles click interactions
        ref={scrollbarRef}
      >
        <div
          className="absolute h-full bg-black rounded-full"
          style={{
            width: `${thumbWidth}px`,
            transform: `translateX(${scrollThumbOffset}px)`,
            transition: "transform 0.1s ease",
          }}
          onMouseDown={handleThumbDragStart} // Handles drag interactions
          onTouchStart={handleThumbDragStart}
        />
      </div>
    </div>
  );
}
