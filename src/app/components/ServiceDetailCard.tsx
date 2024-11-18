import Link from "next/link";

interface ServiceDetailCardProps {
  title: string;
  description: string | null;
  path: string;
  card_width: number;
}

export default function ServiceDetailCard({
  title,
  description,
  path,
  card_width,
}: ServiceDetailCardProps) {
  return (
    <div
      className="bg-[#B4B4B4] h-full flex-shrink-0 relative"
      style={{ width: `${card_width}%` }}
    >
      <div className="flex flex-col gap-[20px] w-[63%] absolute bottom-[8%] left-[6%]">
        <p
          className="text-4xl whitespace-normal"
          style={{ lineHeight: "40.86px" }}
        >
          {title}
        </p>
        {description && (
          <p
            className="text-[#382F26] font-gillSans text-base whitespace-normal tracking-widest"
            style={{ lineHeight: "18.18px" }}
          >
            {description}
          </p>
        )}
      </div>
      <div>
        <Link href={path}>
          <button
            className="absolute font-gillSans bottom-0 right-0 bg-white py-6 px-8 text-base tracking-widest"
            style={{ lineHeight: "18.18px" }}
          >
            Learn More
          </button>
        </Link>
      </div>
    </div>
  );
}
