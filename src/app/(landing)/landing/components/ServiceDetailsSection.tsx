import ServiceDetailSlider from "../../../../components/ServiceDetailSlider";

interface ServiceDetailProps {
  title: string;
  description: string | null;
  services: Array<{ title: string; description: string | null; path: string }>;
}

export default function ServiceDetailSection({
  title,
  description,
  services,
}: ServiceDetailProps) {
  return (
    <div className="grid justify-center items-center gap-10 w-full md:grid-cols-2 pl-2 md:pl-[10%] bg-[#ECE8E3] py-5">
      <div className="w-full md:w-[70%] max-w-full">
        <h2 className="flex text-left text-[20px] font-normal md:text-[64px] font-opus">
          {title}
        </h2>
        <p className="flex w-[60%] justify-center items-center text-[16px] md:text-[24px] font-gillSans break-words whitespace-normal">
          {description}
        </p>
      </div>
      <div className="w-[] h-[400px] pl-2 md:h-[723px] overflow-x-auto md:overflow-x-hidden mb-20">
        <ServiceDetailSlider
          services={services}
          is_dentistry={false}
          // card_width={57.1}
        />
      </div>
    </div>
  );
}
