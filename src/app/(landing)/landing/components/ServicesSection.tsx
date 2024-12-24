import ServiceCard from "./ServiceCard";

const SERVICE_SECTION = [
  {
    title: "Dentistry",
    path: "/",
  },
  {
    title: "Aesthetics",
    path: "/",
  },
  {
    title: "Wellness",
    path: "/",
  },
];

export default function ServiceSection() {
  return (
    <div className="flex flex-col md:flex-row justify-between gap-1 md:gap-2 h-auto font-opus">
      {SERVICE_SECTION.map((service) => (
        <ServiceCard
          key={service.path}
          text={service.title}
          path={service.path}
        />
      ))}
    </div>
  );
}
