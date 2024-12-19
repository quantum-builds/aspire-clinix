import { Dentist } from "@/assets";
import Link from "next/link";

interface CardProps {
  text: string;
  path: string;
}
export default function ServiceCard({ text, path }: CardProps) {
  return (
    <div
      className="bg-no-repeat bg-cover  bg-center  flex flex-col items-center justify-center gap-1 h-screen w-[full] sm:w-[calc(33.33%-6px)] relative font-opus"
      style={{ backgroundImage: `url(${Dentist.src})` }}
    >
      <div className="flex justify-center items-center flex-col">
        <h2 className="text-[22px] md:text-[52px] md:text-wrap lg:text-nowrap leading-[59.02px] font-opus">
          {text}
        </h2>
      </div>
      <div className="absolute bottom-5">
        <Link className="" href={path}>
          <button className="bg-[#F4F3F0] text-xl rounded-[20px] w-[232px] h-[77px] font-opus">
            Explore
          </button>
        </Link>
      </div>
    </div>
  );
}
