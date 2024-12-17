import ServiceDetailSlider from "@/components/ServiceDetailSlider";

interface DentistryDetailSectionProps {
  services: Array<{ title: string; description: string | null; path: string }>;
}

export default function DentistryDetailSection({
  services,
}: DentistryDetailSectionProps) {
  return (
    <div className=" h-screen pl-[130px] pt-[190px] pb-[118px] gap-[190px] bg-[#ECE8E3]">
      <ServiceDetailSlider
        services={services}
        // card_width={35.2}
        is_dentistry={true}
      />
    </div>
  );
}
