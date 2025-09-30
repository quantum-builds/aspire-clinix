import Image from "next/image";
import { AspireDarkLogo } from "@/assets";
import PatientLoginForm from "./components/LoginForm";
import BackButton from "@/app/(dashboards)/components/BackButton";

export default function LoginPage() {
  return (
    <main className="min-h-[103vh] ">
      <BackButton className="bg-gray hover:bg-lightGray w-fit mb-5" />

      <div className="mx-auto w-full bg-dashboardBarBackground rounded-2xl flex flex-col justify-center max-w-lg p-6 md:p-10">
        <div className="w-full flex items-center justify-center mb-8">
          <Image
            src={AspireDarkLogo}
            alt="Aspire Logo"
            width={129}
            height={60}
          />
        </div>
        <header className="mb-8 text-start">
          <h1 className="text-pretty text-2xl font-semibold tracking-tight md:text-3xl">
            Login Patient
          </h1>
          <p className="text-muted-foreground mt-2">
            Log in to your patient portal or create a new profile to get started
            with Aspire.
          </p>
        </header>

        <section className="w-full max-w-lg ">
          <PatientLoginForm />
        </section>
      </div>
    </main>
  );
}
