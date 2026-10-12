import type { Metadata } from "next";
import "./globals.css";
import localFont from "next/font/local";
import { Cormorant_Garamond } from "next/font/google";
import { TanStackProvider } from "@/providers/TanStackProvider";
import ToastProvider from "@/providers/ToastProvider";
import SessionProvider from "@/providers/SessionProvider";


const gillSans = localFont({
  src: "../app/fonts/GillSans.otf",
  variable: "--font-gill-sans",
});

const opus = localFont({
  src: "../app/fonts/Opus.ttf",
  variable: "--font-opus",
});

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-cormorant",
});

export const metadata: Metadata = {
  title: "Aspire Dental Clinic",
  description:
    "Providing expert dental care and comprehensive treatments to help you achieve a healthy, beautiful smile",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`text-[#382F26] ${opus.variable} ${gillSans.variable} ${cormorant.variable}`}>
     
          <TanStackProvider>
            <SessionProvider>
              <ToastProvider>{children}</ToastProvider>
            </SessionProvider>
          </TanStackProvider>
        
      </body>
    </html>
  );
}
