import Link from "next/link";

const SERVICES = [
  { title: "Aspire Dental", path: "/dentistry" },
  { title: "Aspire Asthetics", path: "/asthetics" },
  { title: "Aspire Wellness", path: "/wellness" },
];

export default function ServiceButtons() {
  return (
    <div className="zoom-out flex flex-col">
      <p className=" mb-[53px] text-lg md:text-xl lg:text-2xl flex justify-center items-center xl:text-[28px] 2xl:text-[32px] font-opus leading-[36.32px]">
        BOOK A TREATMENT
      </p>
      {SERVICES.map((service, index) => (
        <Link href={service.path} key={index}>
          <button className=" xl:w-[308px] w-[210px] h-[47px] xl:h-[68px] 2xl:h-[90px] font-opus rounded-[10px] xl:rounded-[20px] leading-[22.7px] bg-feeGuide text-[16px] xl:text-[20px] my-1">
            {service.title}
          </button>
        </Link>
      ))}
    </div>
  );
}
