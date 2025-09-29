import { cn } from "@/lib/utils";
import { StaticImageData } from "next/image";
import Image from "next/image";
import Link from "next/link";
import Spinner from "./Spinner";

interface CustomButtonProps {
  text: string;
  icon?: StaticImageData;
  handleOnClick?: () => void;
  href?: string;
  className?: string;
  disabled?: boolean;
  loading?: boolean;
  style?: "primary" | "secondary";
  type?: "button" | "submit" | "reset";
}

export default function CustomButton({
  text,
  icon,
  href,
  handleOnClick,
  className,
  disabled,
  loading,
  style = "primary",
  type = "button",
}: CustomButtonProps) {
  const btnStyles =
    style === "primary"
      ? "bg-green text-dashboardBarBackground hover:bg-greenHover"
      : "bg-gray text-dashboardTextBlack";

  if (href) {
    return (
      <Link
        href={href}
        className={cn(
          "px-6 py-3 flex items-center justify-center gap-2 rounded-[100px] transition-all",
          btnStyles,
          className
        )}
      >
        {icon && <Image src={icon} alt="button icon" className="w-4 h-4" />}
        <p className="text-[17px]">{text}</p>
      </Link>
    );
  }

  return (
    <button
      type={type}
      disabled={disabled || loading}
      onClick={handleOnClick}
      className={cn(
        "px-6 py-3 flex items-center justify-center gap-2 rounded-[100px] disabled:cursor-not-allowed disabled:opacity-75 transition-all",
        btnStyles,
        className
      )}
    >
      {!loading ? (
        <>
          {icon && <Image src={icon} alt="button icon" className="w-4 h-4" />}
          <p className="text-[17px]">{text}</p>
        </>
      ) : (
        <Spinner />
      )}
    </button>
  );
}
