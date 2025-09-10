import { StaticImageData } from "next/image";
import ServiceDetailSlider from "../../../components/ServiceDetailSlider";

interface ServiceDetailProps {
  title: string;
  description: string | null;
  services: Array<{
    title: string;
    description: string | null;
    path: string;
    backgroundContent: string | StaticImageData;
  }>;
}

export default function ServiceDetailSection({
  title,
  description,
  services,
}: ServiceDetailProps) {
  return (
    <div className="zoom-out grid justify-center items-center gap-[0.5rem] w-full md:grid-cols-3 pl-2 md:pl-[5%] bg-feeGuide py-10 overflow-hidden">
      <div className="w-full flex flex-col gap-7 md:w-[70%]">
        <h2 className="flex text-left text-[55px] md:text-nowrap font-normal md:text-[60px] lg:text-[74px] font-opus">
          {title}
        </h2>
        {description && (
          <p
            className="w-full md:-ellipsis text-[21px] md:text-[22px] lg:text-[27px] xl:text-[30px] font-gillSans break-words whitespace-normal"
            dangerouslySetInnerHTML={{ __html: description }}
          />
        )}
      </div>
      <div
        className="md:h-[450px] w-full overflow-y-auto mb-20 scrollbar-hide pt-[5%] col-span-2"
        style={{
          height: "auto",
          overflow: "hidden",
        }}
      >
        <ServiceDetailSlider services={services} is_dentistry={false} />
      </div>
    </div>
  );
}
