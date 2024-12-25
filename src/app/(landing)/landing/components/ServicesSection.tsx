import ServiceCard from "./ServiceCard";
import { Dentist } from "@/assets";
const SERVICE_SECTION = [
  {
    title: "Dentistry",
    path: "/#dentistry",
    image: Dentist,
  },
  {
    title: "Aesthetics",
    path: "/#aesthetic",
    image: Dentist,
  },
  {
    title: "Wellness",
    path: "/#wellness",
    image: Dentist,
  },
];

export default function ServiceSection() {
  return (
    <div className="flex flex-col justify-between md:flex-row gap-1 md:gap-2 h-auto font-opus">
      {SERVICE_SECTION.map((service) => (
        <ServiceCard
          key={service.path}
          text={service.title}
          path={service.path}
          image={service.image}
        />
      ))}
    </div>
  );
}
