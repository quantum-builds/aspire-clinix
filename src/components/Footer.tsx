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
  backgroundColor: string;
  inputBackgroundColor: string;
  customClasses?: string;
}

export default function Footer({
  backgroundColor,
  inputBackgroundColor,
  customClasses,
}: FooterProps) {
  return (
    <footer
      className={`w-full flex flex-wrap justify-between px-6 py-8 sm:px-12 lg:px-24 xl:px-36 gap-10 ${customClasses}`}
      style={{ backgroundColor }}
    >
      {/* Contact Information */}
      <div className="flex flex-col gap-6 sm:gap-8 w-full sm:w-auto">
        <Image
          src={AspireLightLogo}
          alt="Aspire Clinic Logo"
          width={189}
          height={88}
        />
        <address className="not-italic text-[16px] sm:text-[20px] text-white flex flex-col gap-2 font-gillSans">
          <p>hello@aspireclinic.co.uk</p>
          <p>27 Mortimer Street</p>
          <p>W1N 7RJ, London, UK</p>
          <p>0207 333 333</p>
        </address>
        <p className="text-[16px] font-opus text-white">
          Copyright 2024 Aspire Clinic
        </p>
      </div>

      {/* Newsletter Signup */}
      <div className="flex flex-col gap-6 w-full sm:w-auto">
        <p className="text-[16px] sm:text-[20px] text-white font-normal font-opus">
          Sign up to our newsletter
        </p>
        <EmailInput backgroundColor={inputBackgroundColor} />
      </div>

      {/* Quick Links */}
      <div className="flex flex-col gap-6 w-full sm:w-auto">
        <p className="text-[16] sm:text-[20px] text-white font-normal font-opus">
          Quick Links
        </p>
        <ul className="flex flex-col gap-2 text-[16px] sm:text-[20px]">
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

      {/* Social Media Links */}
      <div className="flex flex-col gap-4 w-full sm:w-auto">
        <p className="text-[16px] sm:text-[20px] text-white font-normal">
          Connect with us
        </p>
        <div className="flex gap-6">
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
    </footer>
  );
}
