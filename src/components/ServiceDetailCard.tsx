import { Dentist } from "@/assets";
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
}

export default function ServiceDetailCard({
  title,
  description,
  path,
  buttonText,
  card_height,
  className,
  doc_name,
}: ServiceDetailCardProps) {
  return (
    <div
      className={` h-full flex-shrink-0 relative  ${
        className || ""
      }  bg-cover bg-center bg-no-repeat`}
      style={{ height: card_height, backgroundImage: `url(${Dentist.src})` }}
    >
      <div className="flex flex-col gap-[20px] absolute bottom-0 left-[6%] mb-10">
        <p
          className="text-4xl whitespace-normal font-opus"
          style={{ lineHeight: "40.86px" }}
        >
          {title}
        </p>
        {description && (
          <p
            className="text-[#382F26] font-gillSans w-80 text-base whitespace-normal tracking-widest"
            style={{ lineHeight: "18.18px" }}
          >
            {description}
          </p>
        )}
      </div>
      <div>
        <Link href={path}>
          <button
            className="absolute font-gillSans bottom-0 rounded-tl-2xl right-0 bg-white py-6 px-1 md:px-8 text-base tracking-widest"
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
