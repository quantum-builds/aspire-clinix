import { cn } from "@/lib/utils";
import { StaticImageData } from "next/image";
import Image from "next/image";
import Link from "next/link";

interface ButtonProps {
  text: string;
  icon?: StaticImageData;
  handleOnClick?: () => void;
  href?: string;
  className?: string;
}

export default function Button({
  text,
  icon,
  href,
  handleOnClick,
  className,
}: ButtonProps) {
  if (href) {
    return (
      <Link
        href={href}
        className={cn(
          "h-[60px] px-6 py-3 font-medium text-lg text-dashboardBarBackground bg-green flex items-center justify-center gap-2 rounded-[100px]",
          className
        )}
      >
        {icon && <Image src={icon} alt="button icon" className="w-4 h-4" />}
        {text}
      </Link>
    );
  }

  return (
    <button
      onClick={handleOnClick}
      className={cn(
        "h-[60px] px-6 py-3 font-medium text-lg text-dashboardBarBackground bg-green flex items-center justify-center gap-2 rounded-[100px]",
        className
      )}
    >
      {icon && <Image src={icon} alt="button icon" className="w-4 h-4" />}
      {text}
    </button>
  );
}
