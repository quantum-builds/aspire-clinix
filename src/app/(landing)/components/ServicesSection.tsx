import ServiceCard from "./ServiceCard";
import {
  DentistTreatment,
  image1,
  image2,
  image3,
  TeethCartoon,
  Wellness4,
} from "@/assets";
const SERVICE_SECTION = [
  {
    title: "Dentistry",
    path: "/#dentistry",
    image: image1,
  },
  {
    title: "Aesthetics",
    path: "/#aesthetic",
    image: image2,
  },
  {
    title: "Wellness",
    path: "/#wellness",
    image: Wellness4,
  },
];

export default function ServiceSection() {
  return (
    <div className="min-h-[90vh] font-opus bg-feeGuide flex items-center">
      <div className="w-4/5 mx-auto flex flex-col justify-between items-center lg:flex-row gap-1 md:gap-2 ">
        {SERVICE_SECTION.map((service) => (
          <ServiceCard
            key={service.path}
            text={service.title}
            path={service.path}
            image={service.image}
          />
        ))}
      </div>
    </div>
  );
}
