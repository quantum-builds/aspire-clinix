import ServiceDetailSlider from "../../../components/ServiceDetailSlider";

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
    <div className="flex h-screen pl-[130px] pt-[190px] pb-[118px] gap-[190px]">
      <div className="w-[30%] flex flex-col gap-[30px]">
        <p className="text-[64px] leading-72.64px]">{title}</p>
        {description && (
          <p className="text-[24px] text-[#382F26] leading-[27.27px] tracking-{10%} font-gillSans">
            {description}
          </p>
        )}
      </div>
      <div className="w-[70%] ">
        <ServiceDetailSlider
          services={services}
          card_width={57.1}
          is_dentistry={false}
        />
      </div>
    </div>
  );
}
