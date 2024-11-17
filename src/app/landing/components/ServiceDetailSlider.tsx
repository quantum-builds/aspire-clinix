import { useEffect, useRef, useState, useCallback } from "react";
import ServiceDetailCard from "./ServiceDetailCard";

interface ServiceDetailSliderProp {
  services: Array<{ title: string; description: string | null; path: string }>;
}

export default function ServiceDetailSlider({
  services,
}: ServiceDetailSliderProp) {
  const containerRef = useRef<HTMLDivElement | null>(null); // Scrollable container
  const scrollThumbRef = useRef<HTMLDivElement | null>(null); // Scrollbar thumb
  const [customScrollbarWidth, setCustomScrollbarWidth] = useState(0); // Width of the scrollbar track
  const [thumbWidth, setThumbWidth] = useState(0); // Width of the scrollbar thumb
  const [scrollThumbOffset, setScrollThumbOffset] = useState(0); // Thumb offset
  const [isDragging, setIsDragging] = useState(false); // Dragging state
  const dragStartX = useRef(0); // Starting position of the drag
  const scrollStartLeft = useRef(0); // Scroll position at drag start

  useEffect(() => {
    const container = containerRef.current;

    if (container) {
      // Calculate the scrollbar and thumb sizes
      setCustomScrollbarWidth(container.clientWidth);
      setThumbWidth(
        (container.clientWidth / container.scrollWidth) * container.clientWidth
      );

      // Update thumb size dynamically on resize
      const handleResize = () => {
        setCustomScrollbarWidth(container.clientWidth);
        setThumbWidth(
          (container.clientWidth / container.scrollWidth) *
            container.clientWidth
        );
      };

      window.addEventListener("resize", handleResize);

      return () => window.removeEventListener("resize", handleResize);
    }
  }, []);

  const handleContainerScroll = () => {
    const container = containerRef.current;

    if (container) {
      // Sync scrollbar thumb position with container scroll
      const scrollPercentage =
        container.scrollLeft / (container.scrollWidth - container.clientWidth);
      setScrollThumbOffset(
        scrollPercentage * (customScrollbarWidth - thumbWidth)
      );
    }
  };

  const handleThumbMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsDragging(true);
    dragStartX.current = e.clientX; // Store the mouse position at drag start
    scrollStartLeft.current = scrollThumbOffset; // Store the current offset
  };

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!isDragging || !containerRef.current) return;

      const container = containerRef.current;

      // Calculate drag distance and new scroll position
      const dragDistance = e.clientX - dragStartX.current;
      const newOffset = Math.min(
        Math.max(scrollStartLeft.current + dragDistance, 0),
        customScrollbarWidth - thumbWidth
      );

      setScrollThumbOffset(newOffset);

      // Scroll the container proportionally
      const scrollPercentage = newOffset / (customScrollbarWidth - thumbWidth);
      container.scrollLeft =
        scrollPercentage * (container.scrollWidth - container.clientWidth);
    },
    [isDragging, customScrollbarWidth, thumbWidth]
  );

  const handleMouseUp = () => {
    setIsDragging(false);
  };

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
    <div className="w-[70%] mr-1 flex flex-col gap-[75px]">
      <div
        ref={containerRef}
        className="flex gap-[60px] overflow-x-auto whitespace-nowrap w-full h-full scrollbar-hide"
        onScroll={handleContainerScroll}
      >
        {services.map((service, index) => (
          <ServiceDetailCard
            key={index}
            title={service.title}
            description={service.description}
            path={service.path}
          />
        ))}
      </div>

      <div className=" h-3 bg-gray-200 rounded-full">
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
