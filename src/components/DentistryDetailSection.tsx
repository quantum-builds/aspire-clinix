import ServiceDetailSlider from "@/components/ServiceDetailSlider";
import { StaticImageData } from "next/image";

interface DentistryDetailSectionProps {
  services: Array<{
    title: string;
    description: string | null;
    path: string;
    backgroundContent: string | StaticImageData;
  }>;
}

export default function DentistryDetailSection({
  services,
}: DentistryDetailSectionProps) {
  return (
    <div className="md:pl-[130px] md:pt-[190px] pb-3 md:pb-[118px] bg-[#ECE8E3]">
      <ServiceDetailSlider
        services={services}
        is_dentistry={true}
        className="mx-auto"
      />
    </div>
  );
}
