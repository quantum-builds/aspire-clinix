import clsx from "clsx";
import { title } from "process";

interface Component1Props {
  title: string;
  descriptionText: string;
  descriptionBullets: string[];
  backgroundColor: string;
  titleFontSize?: string;
}
export default function Component1({
  title,
  descriptionText,
  descriptionBullets,
  backgroundColor,
  titleFontSize,
}: Component1Props) {
  return (
    <div
      className="flex justify-center items-center gap-4 md:gap-16 h-[78vh] font-opus"
      style={{ backgroundColor: backgroundColor }}
    >
      <div className="w-[50%] flex justify-center items-center">
        <h1
          className={clsx(
            "text-center w-full px-2 xl:w-[60%] font-opus font-normal md:leading-[70px] lg:leading-[100px]",
            titleFontSize
          )}
        >
          {title}
        </h1>
      </div>

      <div className="flex flex-col justify-center items-center gap-10 w-[50%] h-[50%] ">
        <p className="text-left zoom-out  md:w-[70%] px-2 md:px-0 text-base md:text-2xl lg:text-4xl font-opus">
          {descriptionText}
        </p>
        <div className="md:w-[50%] flex flex-col gap-7">
          {descriptionBullets.map((text, index) => (
            <p
              className="text-left zoom-out  px-2 md:px-0  text-base md:text-2xl lg:text-4xl font-opus"
              key={index}
            >
              &bull;{text}
            </p>
          ))}
        </div>
      </div>
    </div>
  );
}
