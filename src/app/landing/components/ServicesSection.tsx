import ServiceCard from "./ServiceCard";

const SERVICE_SECTION = [
  {
    title: "Aspire Dental",
    path: "/",
  },
  {
    title: "Aspire Asthetics",
    path: "/",
  },
  {
    title: "Aspire Wellness",
    path: "/",
  },
];

export default function ServiceSection() {
  return (
    <div className="flex flex-wrap justify-between gap-2 h-screen">
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
