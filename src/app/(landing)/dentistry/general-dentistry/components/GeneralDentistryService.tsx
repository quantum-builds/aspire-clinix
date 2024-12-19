import Image, { StaticImageData } from "next/image";

interface GeneralDentistryServiceProp {
  title: string;
  description: string;
  container_side: string;
  imagePath: string | StaticImageData;
}

export default function GeneralDentistryService({
  title,
  description,
  container_side,
  imagePath,
}: GeneralDentistryServiceProp) {
  return (
    <div className="w-full bg-[#ECE8E3] py-[97px] px-[10%]">
      <div className="h-[79vh] grid grid-cols-1 md:grid-cols-2 items-center gap-8">
        {/* Text Section */}
        <div
          className={`flex flex-col justify-center gap-6 md:gap-[67px] w-full ${
            container_side === "right" ? "md:order-2" : "md:order-1"
          }`}
        >
          <h2 className="text-[22px] md:text-[52px] leading-[59.02px] font-bold font-opus">
            {title}
          </h2>
          <p className="text-[16px] md:text-[24px] leading-[27.27px] tracking-widest font-gillSans">
            {description}
          </p>
        </div>

        {/* Image Section */}
        <div
          className={`w-full flex justify-center items-center ${
            container_side === "right" ? "md:order-1" : "md:order-2"
          }`}
        >
          <Image
            src={imagePath}
            alt={title}
            width={705}
            height={500}
            className="object-cover rounded-md"
          />
        </div>
      </div>
    </div>
  );
}
