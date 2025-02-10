import { Suspense } from "react";
import SigninForm from "./component/SignInForm";

export default function LoginFormPage() {
  const Loader = () => {
    return (
      <div className="w-full h-screen flex items-center justify-center bg-gray-100">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500"></div>
      </div>
    );
  };
  return (
    <Suspense fallback={<Loader />}>
      <SigninForm />
    </Suspense>
  );
}
