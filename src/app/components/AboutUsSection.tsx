import Link from "next/link";

interface AboutUsSectionProps {
  description: string;
  description_text_size: number;
  description_leading_height: number;
  has_button: boolean | null;
  background_color: string;
  text_color: string;
  description_width: number;
}
export default function AboutUsSection({
  description,
  description_text_size,
  description_leading_height,
  has_button,
  background_color,
  text_color,
  description_width,
}: AboutUsSectionProps) {
  return (
    <div
      className={`flex flex-col justify-center items-center gap-[60px] h-[72vh]`}
      style={{ backgroundColor: background_color }}
    >
      <p
        className={`text-center w-[${description_width}%]`}
        style={{
          color: text_color,
          fontSize: `${description_text_size}px`,
          lineHeight: `${description_leading_height}px`,
        }}
      >
        {description}
      </p>

      {has_button && (
        <Link href={"/"}>
          <button className="text-[#382F26] bg-[#C9BCA9] text-[20px] rounded-[20px] py-[24px] px-[40px] leading-[22.7px]">
            Our Philosophy
          </button>
        </Link>
      )}
    </div>
  );
}
