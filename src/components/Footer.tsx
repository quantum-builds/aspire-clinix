import { AspireLightLogo, InstagramIcon, LinkedinIcon, XIcon } from "@/assets";
import Image from "next/image";
import EmailInput from "./EmailInput";
import Link from "next/link";

const IN_PAGE_NAV_LINKS = [
  { label: "Our Philosophy", path: "/" },
  { label: "Aspire Dental", path: "/" },
  { label: "Aspire Aesthetics", path: "/" },
  { label: "Aspire Wellness", path: "/" },
  { label: "Referral Portal", path: "/" },
];

const SOCIAL_ICONS = [
  { src: InstagramIcon, alt: "Instagram", path: "/", height: 30, width: 30 },
  { src: XIcon, alt: "X (Twitter)", path: "/", height: 30, width: 30 },
  { src: LinkedinIcon, alt: "LinkedIn", path: "/", height: 25, width: 25 },
];

interface FooterProps {
  inputBackgroundColor: string;
}

export default function Footer({ inputBackgroundColor }: FooterProps) {
  return (
    <footer className="bg-[#1D120C]">
      <div className="grid gap-12 md:gap-20  ml-4 lg:ml-0 md:pl-2 md:grid-cols-4 justify-items-start md:justify-items-center py-12">
        {/* Logo and Address Section */}
        <div className="flex flex-col items-start">
          <Image
            src={AspireLightLogo}
            alt="Aspire Clinic Logo"
            width={189}
            height={88}
            className="w-[100px] h-[50px] lg:w-[189px] lg:h-[88px] md:w-[120px] md:h-[50px]"
          />
          <address className="not-italic  md:text-[16px] text-[16px] sm:text-[20px] text-white flex flex-col items-start font-gillSans mt-4">
            <p>hello@aspireclinic.co.uk</p>
            <p>27 Mortimer Street</p>
            <p>W1N 7RJ, London, UK</p>
            <p>0207 333 333</p>
          </address>
        </div>

        {/* Newsletter Signup Section */}
        <div className="flex flex-col  items-start">
          <p className="text-[16px] sm:text-[20px] text-white font-normal font-opus mb-4 md:mb-8">
            Sign up to our newsletter
          </p>
          <EmailInput backgroundColor={inputBackgroundColor} />
        </div>

        {/* Quick Links Section */}
        <div className="flex flex-col items-start">
          <p className="text-white text-[18px] sm:text-[20px] font-normal font-opus mb-4">
            Quick Links
          </p>
          <ul className="flex flex-col gap-2">
            {IN_PAGE_NAV_LINKS.map((link, index) => (
              <li key={index}>
                <Link
                  href={link.path}
                  className="font-gillSans text-white hover:underline"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Social Icons Section */}
        <div className="flex flex-col items-start">
          <p className="text-[16px] lg:text-[20px] text-white font-normal font-opus mb-4">
            Connect with us
          </p>
          <div className="flex pr-2  gap-6">
            {SOCIAL_ICONS.map((icon, index) => (
              <Link key={index} href={icon.path} aria-label={icon.alt}>
                <Image
                  src={icon.src}
                  alt={icon.alt}
                  width={icon.width}
                  height={icon.height}
                  className="filter grayscale-0 invert hover:opacity-80"
                />
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Footer Bottom */}
      <div className="bg-[#1D120C] py-4">
        <p className="text-left ml-4 md:ml-10 text-white font-opus">
          Copyright 2024 Aspire Clinic
        </p>
      </div>
    </footer>
  );
}
