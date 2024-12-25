import Image from "next/image";
import { AspireDarkLogo } from "@/assets";
import Link from "next/link";

export default function AspireLogo() {
  return (
    <Link href="/" scroll={false}>
    <Image
      src={AspireDarkLogo}
      alt="Aspire Clinic"
      width={189}
      height={88}
      className="mt-[53px]"
    />
    </Link>
  );
}
