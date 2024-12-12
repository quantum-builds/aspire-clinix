import Link from "next/link";

interface CardProps {
  text: string;
  path: string;
}
export default function ServiceCard({ text, path }: CardProps) {
  return (
    <div className="flex flex-col items-center justify-center h-full w-full bg-[#D9D9D9] sm:w-[calc(33.33%-6px)] p-[60px] relative font-opus">
      <p className="text-[52px] leading-[59.02px] font-opus">{text}</p>
      <Link className="flex justify-center" href={path}>
        <button className="bg-[#F4F3F0] text-xl px-[100px] py-[30px] rounded-[20px] absolute bottom-24 leading-[22.7px]">
          Explore
        </button>
      </Link>
    </div>
  );
}
