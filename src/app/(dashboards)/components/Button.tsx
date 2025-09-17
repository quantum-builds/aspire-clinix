import { cn } from "@/lib/utils";
import { StaticImageData } from "next/image";
import Image from "next/image";
import Link from "next/link";

interface ButtonProps {
  text: string;
  icon?: StaticImageData;
  href: string;
  className?: string | undefined;
}

export default function Button({ text, icon, href, className }: ButtonProps) {
  return (
    <Link
      href={href}
      className={cn(
        "h-[60px] px-6 py-3 font-medium text-lg text-dashboardBarBackground bg-green flex items-center justify-center gap-2 rounded-[100px] ",
        className
      )}
    >
      {icon && <Image src={icon} alt="button icon" className="w-4 h-4" />}
      {text}
    </Link>
  );
}
