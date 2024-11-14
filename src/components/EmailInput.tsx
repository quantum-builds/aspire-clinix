import { ArrowIcon } from "@/assets";
import Image from "next/image";

export default function EmailInput() {
  return (
    <div className="flex items-center border px-6 py-3 rounded-[10px] border-black w-full">
      <input
        type="email"
        name="userEmail"
        placeholder="Email Address"
        className="p-2 border-none text-black"
      />
      <Image src={ArrowIcon} alt="Submit Arrow" />
    </div>
  );
}
