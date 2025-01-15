"use client";

import { useState } from "react";
import AspireLogo from "../book-treatment/components/AspireLogo";

const LoginForm = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle the login logic here (e.g., call API)
    console.log("Email:", email);
    console.log("Password:", password);
  };

  return (
    <div className="w-full h-screen flex justify-center items-center bg-grey100 font-opus text-[#382F26]">
      <div className="zoom-out absolute top-5">
        <AspireLogo />
        <h2 className="mb-8 mt-5 text-center text-[24px] md:text-[32px] font-normal font-opus">
          Login
        </h2>
      </div>

      <form
        onSubmit={handleSubmit}
        className="zoom-out w-full md:w-1/2 h-full p-6 flex flex-col items-center justify-center bg-formBackground"
      >
        <div className="w-full md:w-1/2">
          <div className="mb-6">
            <label
              htmlFor="email"
              className="block text-sm font-opus font-normal text-black mb-2"
            >
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="mt-1 block w-full p-3 border bg-formBackground outline-none border-black rounded-md"
              placeholder="Enter your email"
            />
          </div>

          <div className="mb-6">
            <label
              htmlFor="password"
              className="block text-sm font-normal font-opus text-black mb-2"
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="mt-1 block w-full p-3 border bg-formBackground outline-none border-black rounded-md"
              placeholder="Enter your password"
            />
          </div>

          <button
            type="submit"
            className="w-[153px] h-[45px] py-3 bg-feeGuide text-black rounded-md font-normal font-opus"
          >
            Login
          </button>
        </div>
      </form>
    </div>
  );
};

export default LoginForm;
