import { AspireClinixIcon } from "@/assets";
import Image from "next/image";
import HeroMenu from "./HeroMenu";
import Link from "next/link";

interface HeroSectionProps {
  title: string;
  description?: string | null;
  title_text_size: number;
  title_line_height: number;
  desc_text_size?: number | null;
  desc_line_height?: number | null;
  content_width?: number | null;
  background_color: string;
  button_color: string;
}

export default function HeroSection({
  title,
  description,
  title_text_size,
  title_line_height,
  desc_text_size,
  desc_line_height,
  content_width,
  background_color,
  button_color,
}: HeroSectionProps) {
  return (
    <div
      className="flex flex-col items-center h-screen relative"
      style={{ backgroundColor: background_color }}
    >
      {/* Header section */}
      <header className="flex justify-between w-full items-center h-[200px] px-[8%] leading-[27.27px] tracking-widest text-2xl">
        <HeroMenu />
        <Image
          src={AspireClinixIcon}
          alt="Aspire Clinix"
          width={189}
          height={88}
          className="ml-64"
        />
        <Link href="/book-treatment" scroll={false}>
          <button
            className="px-[19px] py-[28px] rounded-[20px] text-[22.7px] leading-[22.7px]"
            style={{ backgroundColor: button_color }}
          >
            BOOK A TREATMENT
          </button>
        </Link>
      </header>

      {/* Main content */}
      <div
        className="flex flex-col justify-center items-center gap-[59px] h-full"
        style={{ width: content_width ? `${content_width}%` : "100%" }}
      >
        {/* Title */}
        <p
          className="text-center"
          style={{
            fontSize: `${title_text_size}px`,
            lineHeight: `${title_line_height}px`,
          }}
        >
          {title}
        </p>

        {/* Description */}
        {description && desc_text_size && desc_line_height && (
          <p
            className="text-center font-gillSans"
            style={{
              fontSize: `${desc_text_size}px`,
              lineHeight: `${desc_line_height}px`,
            }}
          >
            {description}
          </p>
        )}
      </div>
    </div>
  );
}
