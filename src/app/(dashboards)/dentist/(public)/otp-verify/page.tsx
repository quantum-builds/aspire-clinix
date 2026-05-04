import Image from "next/image";
import { AspireDarkLogo } from "@/assets";
import DentistOtpVerifyForm from "./components/OtpVerifyForm";
import BackButton from "@/app/(dashboards)/components/BackButton";

export default function OtpVerifyPage() {
  return (
    <main className="min-h-[111vh]">
      <BackButton
        className="bg-gray hover:bg-lightGray w-fit mb-5"
        backToWebsite={true}
        text="Back To Website"
      />

      <div className="mx-auto w-full bg-dashboardBarBackground rounded-2xl flex flex-col justify-center max-w-3xl p-6 md:p-10">
        <div className="w-full flex items-center justify-center mb-8">
          <Image
            src={AspireDarkLogo}
            alt="Aspire Logo"
            width={129}
            height={60}
          />
        </div>
        <header className="mb-8 text-start">
          <h1 className="text-pretty text-2xl font-medium tracking-tight">
            Verify OTP
          </h1>
          <p className="text-muted-foreground mt-2">
            Enter the OTP code sent to your email to verify your identity and access your dentist portal.
          </p>
        </header>

        <section className="w-full grid gap-6">
          <DentistOtpVerifyForm />
        </section>
      </div>
    </main>
  );
}
