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
    <div className="grid justify-center items-center gap-[0.5rem] w-full md:grid-cols-2 pl-2 md:pl-[5%] bg-[#ECE8E3] py-10 overflow-hidden">
      <div className="w-full flex flex-col gap-7 md:w-[70%]">
        <h2 className="flex text-left text-[20px] md:text-nowrap font-normal md:text-[50px] lg:text-[64px] font-opus">
          {title}
        </h2>
        <p className="flex w-[100%] md:text-ellipsis justify-center items-center text-[16px] md:text-[24px] font-gillSans break-words whitespace-normal">
          {description}
        </p>
      </div>
      <div
        className="pl-2 md:h-[403px] w-full overflow-y-auto mb-20 scrollbar-hide pt-[5%]"
        style={{
          height: "auto",
          overflow: "hidden",
        }}
      >
        <ServiceDetailSlider
          services={services}
          is_dentistry={false}
          // scrollbarwidthOverride={400}
        />
      </div>
    </div>
  );
}
