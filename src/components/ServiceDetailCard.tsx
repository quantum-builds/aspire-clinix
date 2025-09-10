import Image, { StaticImageData } from "next/image";
import Link from "next/link";

interface ServiceDetailCardProps {
  title?: string | null;
  titleColor?: string | null;
  description?: string | null;
  path: string;
  cardWidth?: number;
  buttonText: string;
  cardHeight?: number;
  className?: string;
  docName?: string;
  docNameColor?: string;
  backgroundContent?: string | StaticImageData;
  isVideo?: boolean;
  onLoad?: () => void;
  brightness?: number;
}

export default function ServiceDetailCard({
  title,
  titleColor = "trueBlack",
  description,
  path,
  buttonText,
  cardHeight,
  className,
  docName,
  docNameColor = "white",
  backgroundContent,
  isVideo = false,
  brightness = 0.5,
  onLoad,
}: ServiceDetailCardProps) {
  return (
    <div
      className={` h-full flex-shrink-0 relative  ${
        className || ""
      }  bg-cover bg-center bg-no-repeat`}
      style={{ height: cardHeight }}
    >
      {/* <Image
        className="absolute top-0 left-0 w-full h-full object-cover"
        alt="Background Image"
        src={backgroundContent as StaticImageData}
        style={{ filter: "brightness(0.5)" }}
        onLoad={onLoad}
        priority
      /> */}
      {backgroundContent &&
        (isVideo ? (
          <video
            className="absolute top-0 left-0 w-full h-full  object-cover"
            src={backgroundContent as string}
            style={{ filter: "brightness(0.5)" }}
            autoPlay
            loop
            muted
            preload="auto"
          ></video>
        ) : (
          <Image
            className="absolute top-0 left-0 w-full h-full object-cover rounded-2xl"
            alt="Background Image"
            style={{ filter: `brightness(${brightness})` }}
            src={backgroundContent}
            onLoad={onLoad}
            priority
          />
        ))}
      <div className="flex flex-col gap-[20px] absolute bottom-0 left-[6%] mb-10 ">
        <p
          className="text-4xl md:text-5xl lg:text-5xl xl:text-6xl whitespace-normal font-opus text-white "
          style={{ lineHeight: "40.86px" }}
        >
          {title}
        </p>
        {description && (
          <p
            className="text-white font-gillSans w-80 sm:w-96 md:w-full mb-7 text-sm sm:text-[40px] md:text-lg lg:text-xl xl:text-1.5xl whitespace-normal tracking-widest"
            style={{ lineHeight: "24.18px" }}
          >
            {description}
          </p>
        )}
      </div>
      <div>
        <Link href={path}>
          <button
            className="absolute font-opus bottom-0 rounded-tl-2xl rounded-br-2xl w-[150px] h-[65px] right-0 bg-feeGuide  tracking-widest text-lg md:text-xl lg:text2xl"
            style={{ lineHeight: "18.18px" }}
          >
            {buttonText}
          </button>
        </Link>
      </div>
      {docName && (
        <div className="absolute bottom-[-40px] left-0 w-full">
          <p
            className={`text-lg md:text-xl xl:text-2xl font-opus text-${docNameColor} `}
          >
            {docName}
          </p>
        </div>
      )}
    </div>
  );
}
