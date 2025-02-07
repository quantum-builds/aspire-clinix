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
      className="flex justify-center items-center gap-16 md:gap-1 min-h-screen font-opus"
      style={{ backgroundColor: backgroundColor }}
    >
      <div className="w-[50%] flex justify-center items-center">
        <h1
          className={clsx(
            "text-center w-full xl:w-[60%] font-opus font-normal md:leading-[70px] lg:leading-[100px]",
            titleFontSize
          )}
        >
          {title}
        </h1>
      </div>

      <div className="flex flex-col justify-center items-center gap-4 w-[50%] h-[70%] ">
        <p className="zoom-out text-center w-[80%] md:h-[190px] px-2 md:px-0 h-[170px] text-base md:text-2xl font-opus">
          {descriptionText}
        </p>
        <div className="w-[60%]">
          {descriptionBullets.map((text, index) => (
            <p
              className="zoom-out text-center md:h-[190px] px-2 md:px-0 h-[170px] text-base md:text-2xl font-opus"
              key={index}
            >
              .{text}
            </p>
          ))}
        </div>
      </div>
    </div>
  );
}
