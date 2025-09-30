import Image from "next/image";
import { AspireDarkLogo } from "@/assets";
import AdminRegisterForm from "./components/RegisterForm";
import BackButton from "@/app/(dashboards)/components/BackButton";

export default function RegisterPage() {
  return (
    <main className="min-h-[103vh] ">
      <BackButton
        className="bg-gray hover:bg-lightGray w-fit mb-5"
        backToWebsite={true}
        text="Back To Website"
      />

      <div className="mx-auto w-full flex flex-col bg-dashboardBarBackground rounded-2xl  justify-center max-w-lg p-6 md:p-10">
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
            Register Admin
          </h1>
          <p className="text-muted-foreground mt-2">
            Create a admin profile with basic details and an optional profile
            image.
          </p>
        </header>

        <section className="w-full grid gap-6 md:grid-cols-5">
          <div className="md:col-span-5 ">
            <AdminRegisterForm />
          </div>
        </section>
      </div>
    </main>
  );
}
