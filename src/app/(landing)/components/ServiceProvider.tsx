import ServiceDetailCard from "@/components/ServiceDetailCard";
import { StaticImageData } from "next/image";

interface ServiceProviderProps {
  text: string;
  cardData: {
    path: string;
    cardWidth: number;
    buttonText: string;
    cardHeight: number;
    docName: string;
    backgroundContent: StaticImageData;
  }[];
}

export default function ServiceProvider({
  text,
  cardData,
}: ServiceProviderProps) {
  return (
    <div className="zoom-out bg-bookATreatmentBackground flex flex-col gap-16 md:gap-20 lg:gap-28 w-full mx-auto min-h-screen py-[4%]">
      <div className="flex flex-col w-full gap-16 md:gap-20 lg:px-12">
        <div className="w-10/12 mx-auto">
        <p className=" font-opus text-2xl md:text-3xl xl:text-4xl text-trueBlack">{text}</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-2 md:gap-x-4 lg:gap-x-16 gap-y-16 md:gap-y-20 lg:gap-y-28 justify-items-center mx-0 md:mx-auto">
          {cardData.map((card, index) => (
            <ServiceDetailCard
              key={index}
              path={card.path}
              backgroundContent={card.backgroundContent}
              cardWidth={card.cardWidth}
              buttonText={card.buttonText}
              cardHeight={card.cardHeight}
              docName={card.docName}
              docNameColor="trueBlack"
              brightness={0.8}
              className="w-[320px] sm:w-[360px] md:w-[424px] h-auto xl:w-[380px] 2xl:w-[424px]"
            />
          ))}
        </div>
      </div>
    </div>
  );
}
