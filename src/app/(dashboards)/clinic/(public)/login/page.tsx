import Image from "next/image";
import { AspireDarkLogo } from "@/assets";
import AdminLoginForm from "./components/LoginForm";

export default function LoginPage() {
  return (
    <main className="min-h-full ">
      <div className="w-full flex items-center justify-center">
        <Image src={AspireDarkLogo} alt="Aspire Logo" width={129} height={60} />
      </div>
      <div className="mx-auto w-full flex flex-col items-center justify-center max-w-7xl p-6 md:p-10">
        <header className="mb-10 text-center">
          <h1 className="text-pretty text-2xl font-semibold tracking-tight md:text-3xl">
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
