import clsx from "clsx";
import Image, { type StaticImageData } from "next/image";

interface Component2Props {
  title: string;
  descriptionText: string;
  backgroundColor: string;
  titleFontSize?: string;
  imagePath: StaticImageData;
}

export default function Component2({
  title,
  descriptionText,
  backgroundColor,
  titleFontSize,
  imagePath,
}: Component2Props) {
  return (
    <div
      className="flex flex-col md:flex-row justify-center items-center gap-4 md:gap-6 min-h-[45vh] font-opus px-4 md:px-8"
      style={{ backgroundColor: backgroundColor }}
    >
      {/* <div className="bg-black w-full h-full flex items-center justify-center text-white rounded-2xl">
        ded
      </div> */}
      {/* Image Section */}
      <div className="w-full md:w-[45%] lg:w-[50%] flex justify-center md:justify-start items-center">
        <div className="w-full max-w-none md:max-w-[85%] lg:max-w-[75%] xl:max-w-[80%]">
          <Image
            src={imagePath || "/placeholder.svg"}
            alt={title}
            className="w-full h-full object-cover"
            // className=" object-cover"
          />
        </div>
      </div>

      {/* Content Section */}
      <div className="flex flex-col justify-center items-start gap-4 md:gap-6 w-full md:w-[55%] lg:w-[50%] py-6 md:py-8">
        <h1
          className={clsx(
            "w-full max-w-none md:max-w-[85%] lg:max-w-[75%] font-opus font-normal leading-tight md:leading-[1.2] lg:leading-[1.3] text-center md:text-start",
            titleFontSize
          )}
        >
          {title}
        </h1>

        <div className="w-full lg:w-[60%] xl:w-[65%] flex flex-col gap-3 md:gap-4 lg:gap-5">
          <div
            className="text-left text-xs sm:text-sm md:text-base lg:text-lg xl:text-xl font-opus leading-relaxed text-[#1D120C]"
            dangerouslySetInnerHTML={{ __html: descriptionText }}
          />
        </div>
      </div>
    </div>
  );
}
