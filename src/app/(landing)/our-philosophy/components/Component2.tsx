import clsx from "clsx";
import Image, { StaticImageData } from "next/image";

interface Component2Props {
  title: string;
  firstDescriptionText: string;
  secondDescriptionText: string;
  backgroundColor: string;
  titleFontSize?: string;
  imagePath: StaticImageData;
}
export default function Component2({
  title,
  firstDescriptionText,
  secondDescriptionText,
  backgroundColor,
  titleFontSize,
  imagePath,
}: Component2Props) {
  return (
    <div
      className=" flex flex-col md:flex-row justify-center gap-6 md:gap-10 xl:gap-20 items-center h-[78vh] font-opus"
      style={{ backgroundColor: backgroundColor }}
    >
      <div className="w-2/3 md:w-1/2 flex p-2 ">
        <Image
          src={imagePath}
          alt={title}
          className="w-full h-full xl:w-5/6 xl:h-5/6 mx-auto object-cover rounded-2xl"
        />
      </div>
      <div className="flex flex-col justify-center gap-5 md:gap-10 w-2/3  md:w-1/2 h-1/2 ">
        <h1
          className={clsx(
            "text-left font-opus font-normal md:leading-[50px] lg:leading-[70px]  md:w-[80%]",
            titleFontSize
          )}
        >
          {title}
        </h1>
        <p className="text-left zoom-out  md:w-[80%] px-2 md:px-0 text-base md:text-2xl xl:text-4xl font-opus">
          {firstDescriptionText}
        </p>
        <p className="text-left zoom-out  md:w-[80%] px-2 md:px-0 text-base md:text-2xl xl:text-4xl font-opus">
          {secondDescriptionText}
        </p>
      </div>
    </div>
  );
}
