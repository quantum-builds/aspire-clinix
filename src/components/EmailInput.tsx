import { ArrowRightIcon } from "@/assets";
import Image from "next/image";

interface EmailInputProp {
  background_color: string;
  borderColor?: string;
  textColor?: string;
  placeholderColor?: string;
  arrowColor?: string;
}

export default function EmailInput({
  background_color,
  borderColor,
  textColor,
  arrowColor,
}: EmailInputProp) {
  return (
    <div
      className="flex items-center border px-6 py-3 rounded-[10px] border-black w-full"
      style={{ borderColor: borderColor }}
    >
      <input
        type="email"
        name="userEmail"
        placeholder="Email Address"
        className="p-2 border-none text-black focus:outline-none w-full"
        style={{
          backgroundColor: background_color,
          color: textColor,
          caretColor: textColor,
        }}
      />
      <Image
        src={ArrowRightIcon}
        alt="Submit Arrow"
        className={arrowColor === "white" ? "invert" : ""}
        // className={arrowColor === "white" ? "text-white" : "text-black"}
      />
    </div>
  );
}
