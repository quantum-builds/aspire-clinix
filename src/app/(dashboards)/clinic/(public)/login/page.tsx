import Image from "next/image";
import { AspireDarkLogo } from "@/assets";
import AdminLoginForm from "./components/LoginForm";
import BackButton from "@/app/(dashboards)/components/BackButton";

export default function LoginPage() {
  return (
    <main className="min-h-[111vh] ">
      <BackButton
        className="bg-gray hover:bg-lightGray w-fit mb-5"
        backToWebsite={true}
        text="Back To Website"
      />

      <div className="mx-auto w-full bg-dashboardBarBackground rounded-2xl flex flex-col items-center justify-center max-w-lg p-6 md:p-10">
        <div className="w-full flex items-center justify-center mb-8">
          <Image
            src={AspireDarkLogo}
            alt="Aspire Logo"
            width={129}
            height={60}
          />
        </div>
        <header className="mb-8 text-start">
          <h1 className="text-pretty text-2xl font-medium tracking-tight ">
            Login Admin
          </h1>
          <p className="text-muted-foreground mt-2">
            Log in to your admin portal or create a new profile to get started
            with Aspire.
          </p>
        </header>

        <section className="w-full max-w-lg ">
          <AdminLoginForm />
        </section>
      </div>
    </main>
  );
}
