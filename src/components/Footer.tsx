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
      className={`w-full flex flex-wrap justify-between text-xl px-[150px] py-[40px] gap-[40px] ${customClasses}`}
      style={{ backgroundColor: backgroundColor }}
    >
      {/* Contact Information */}
      <div className="flex flex-col gap-[60px] w-full sm:w-auto">
        <Image
          src={AspireLightLogo}
          alt="Aspire Clinic Logo"
          width={189}
          height={88}
        />
        <address className="not-italic text-white flex flex-col gap-[15px] font-gillSans">
          <p>hello@aspireclinic.co.uk</p>
          <p>27 Mortimer Street</p>
          <p>W1N 7RJ, London, UK</p>
          <p>0207 333 333</p>
        </address>
        <p className="text-[16px] text-white">Copyright 2024 Aspire Clinic</p>
      </div>

      {/* Newsletter Signup */}
      <div className="flex text-white flex-col gap-[60px] w-full sm:w-auto">
        <p className="text-[20px]">Sign up to our newsletter</p>
        <EmailInput backgroundColor={inputBackgroundColor} />
      </div>

      {/* Quick Links */}
      <div className="flex text-white flex-col pl-[30px] gap-[60px] w-full sm:w-auto">
        <p>Quick Links</p>
        <ul className="flex flex-col gap-[10px]">
          {IN_PAGE_NAV_LINKS.map((link, index) => (
            <li key={index}>
              <Link href={link.path} className="font-gillSans">
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>

      {/* Social Media Links */}
      <div className="flex text-white flex-col pl-[30px] gap-[20px] w-full sm:w-auto">
        <p>Connect with us</p>
        <div className="flex justify-between">
          {SOCIAL_ICONS.map((icon, index) => (
            <Link key={index} href={icon.path} aria-label={icon.alt}>
              <Image
                src={icon.src}
                alt={icon.alt}
                width={icon.width}
                height={icon.height}
                className="filter grayscale-0 invert"
              />
            </Link>
          ))}
        </div>
      </div>
    </footer>
  );
}
