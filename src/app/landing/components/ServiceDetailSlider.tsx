import { useRef, useState } from "react";
import ServiceDetailCard from "./ServiceDetailCard";

interface ServiceDetailSliderProp {
  services: Array<{ title: string; description: string | null; path: string }>;
}

export default function ServiceDetailSlider({
  services,
}: ServiceDetailSliderProp) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [sliderValue, setSliderValue] = useState<number>(0);
  const cardCount = services.length;

  const handleContainerScroll = () => {
    if (containerRef.current) {
      const container = containerRef.current;
      const maxScrollLeft = container.scrollWidth - container.clientWidth;
      const newSliderValue = Math.round(
        (container.scrollLeft / maxScrollLeft) * (cardCount - 1)
      );
      setSliderValue(newSliderValue);
    }
  };

  const handleSliderChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = parseInt(event.target.value, 10);
    setSliderValue(newValue);

    if (containerRef.current) {
      const container = containerRef.current;
      const maxScrollLeft = container.scrollWidth - container.clientWidth;
      const newScrollLeft = (newValue / (cardCount - 1)) * maxScrollLeft;
      container.scrollLeft = newScrollLeft;
    }
  };

  return (
    <div className="w-[70%] flex flex-col gap-[80px]">
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

      <input
        type="range"
        min="0"
        max={cardCount - 1}
        step="1"
        value={sliderValue}
        onChange={handleSliderChange}
        className="w-full cursor-pointer scrollbar-corner-transparent scrollbar-thumb-black scrollbar scrollbar-track-gray-200"
      />
    </div>
  );
}
