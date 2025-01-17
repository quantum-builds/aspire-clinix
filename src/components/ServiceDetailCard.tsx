import Image, { StaticImageData } from "next/image";
import Link from "next/link";

interface ServiceDetailCardProps {
  title?: string | null;
  description?: string | null;
  path: string;
  card_width?: number;
  buttonText: string;
  card_height?: number;
  className?: string;
  doc_name?: string;
  backgroundContent?: string | StaticImageData;
  onLoad?: () => void;
}

export default function ServiceDetailCard({
  title,
  description,
  path,
  buttonText,
  card_height,
  className,
  doc_name,
  backgroundContent,
  onLoad,
}: ServiceDetailCardProps) {
  return (
    <div
      className={` h-full flex-shrink-0 relative  ${
        className || ""
      }  bg-cover bg-center bg-no-repeat`}
      style={{ height: card_height }}
    >
      <Image
        className="absolute top-0 left-0 w-full h-full object-cover"
        alt="Background Image"
        src={backgroundContent as StaticImageData}
        onLoad={onLoad}
        priority
      />
      <div className="flex flex-col gap-[20px] absolute bottom-0 left-[6%] mb-10">
        <p
          className="text-4xl whitespace-normal font-opus"
          style={{ lineHeight: "40.86px" }}
        >
          {title}
        </p>
        {description && (
          <p
            className="text-[#382F26] font-gillSans w-80 mb-7 text-base whitespace-normal tracking-widest"
            style={{ lineHeight: "18.18px" }}
          >
            {description}
          </p>
        )}
      </div>
      <div>
        <Link href={path}>
          <button
            className="absolute font-gillSans bottom-0 rounded-tl-2xl w-[150px] h-[65px] right-0 bg-feeGuide text-base tracking-widest"
            style={{ lineHeight: "18.18px" }}
          >
            {buttonText}
          </button>
        </Link>
      </div>
      {doc_name && (
        <div className="absolute bottom-[-30px] left-0 w-full">
          <p className="text-lg font-semibold">{doc_name}</p>
        </div>
      )}
    </div>
  );
}
