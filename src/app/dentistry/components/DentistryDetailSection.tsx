import ServiceDetailSlider from "@/app/components/ServiceDetailSlider";

interface DentistryDeatilSectionProps {
  services: Array<{ title: string; description: string | null; path: string }>;
}

export default function DentistryDeatilSection({
  services,
}: DentistryDeatilSectionProps) {
  return (
    <div className=" h-screen pl-[130px] pt-[190px] pb-[118px] gap-[190px]">
      <ServiceDetailSlider
        services={services}
        card_width={35.2}
        is_dentistry={true}
      />
    </div>
  );
}
