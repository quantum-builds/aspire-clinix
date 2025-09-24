import type { Metadata } from "next";
import "./globals.css";
import localFont from "next/font/local";
import { TanStackProvider } from "@/providers/TanStackProvider";
import ToastProvider from "@/providers/ToastProvider";

const gillSans = localFont({
  src: "../app/fonts/GillSans.otf",
  variable: "--font-gill-sans",
});

const opus = localFont({
  src: "../app/fonts/Opus.ttf",
  variable: "--font-opus",
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
      <body className={`text-[#382F26] ${opus.variable}  ${gillSans.variable}`}>
        <TanStackProvider>
          <ToastProvider>{children}</ToastProvider>
        </TanStackProvider>
      </body>
    </html>
  );
}
