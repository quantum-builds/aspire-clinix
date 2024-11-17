import Link from "next/link";

interface ServiceDetailCardProps {
  title: string;
  description: string | null;
  path: string;
}

export default function ServiceDetailCard({
  title,
  description,
  path,
}: ServiceDetailCardProps) {
  return (
    <div className="bg-[#B4B4B4] w-[60%] flex-shrink-0 relative">
      <div className="flex flex-col gap-[20px] w-[63%] absolute bottom-[8%] left-[6%] ">
        <p className="text-4xl whitespace-normal leading-{40.86px}">{title}</p>
        {description && (
          <p className="text-[#382F26] text-base whitespace-normal leading-{18.18px} tracking-widest">
            {description}
          </p>
        )}
      </div>
      <div>
        <Link href={path}>
          <button className="absolute bottom-0 right-0 bg-white py-6 px-8 text-base leading-{18.18px} tracking-widest">
            Learn More
          </button>
        </Link>
      </div>
    </div>
  );
}
