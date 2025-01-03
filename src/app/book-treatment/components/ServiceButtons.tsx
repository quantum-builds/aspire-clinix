import Link from "next/link";

const SERVICES = [
  { title: "Aspire Dental", path: "/" },
  { title: "Aspire Asthetics", path: "/" },
  { title: "Aspire Wellness", path: "/" },
];

export default function ServiceButtons() {
  return (
    <div className="flex flex-col">
      <p className="mb-[53px] text-[32px] font-opus leading-[36.32px]">
        BOOK A TREATMENT
      </p>
      {SERVICES.map((service, index) => (
        <Link href={service.path} key={index}>
          <button className=" w-[308px] h-[90px] font-opus rounded-[20px] leading-[22.7px] bg-feeGuide text-[20px] my-2">
            {service.title}
          </button>
        </Link>
      ))}
    </div>
  );
}
