import Image from "next/image";
import { AspireClinixIcon } from "@/assets";

export default function AspireLogo() {
  return (
    <Image
      src={AspireClinixIcon}
      alt="Aspire Clinic"
      width={189}
      height={88}
      className="mt-[53px]"
    />
  );
}
