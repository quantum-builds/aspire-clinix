import ServiceCard from "./ServiceCard";
import { DentistTreatment, TeethCartoon } from "@/assets";
const SERVICE_SECTION = [
  {
    title: "Dentistry",
    path: "/#dentistry",
    image: DentistTreatment,
  },
  {
    title: "Aesthetics",
    path: "/#aesthetic",
    image: TeethCartoon,
  },
  {
    title: "Wellness",
    path: "/#wellness",
    image: DentistTreatment,
  },
];

export default function ServiceSection() {
  return (
    <div className=" flex flex-col justify-between md:flex-row gap-1 md:gap-2 h-auto font-opus">
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
