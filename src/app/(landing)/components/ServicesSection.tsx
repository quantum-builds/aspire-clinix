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
    <div
      className=" flex flex-col justify-between md:flex-row gap-1 md:gap-2 h-auto font-opus "
      style={{ backgroundColor: "#ECE8E3" }}
    >
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
