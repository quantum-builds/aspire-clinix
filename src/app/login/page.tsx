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
      <div className="absolute top-5">
        <AspireLogo />
        <h2 className="mb-8 mt-5 text-center text-[24px] md:text-[32px] font-semibold">
            Login
          </h2>
      </div>

      <form
        onSubmit={handleSubmit}
        className="w-full md:w-1/2 h-full p-6 flex flex-col items-center justify-center bg-menuBar rounded-lg shadow-md"
      >
        <div className="w-full md:w-3/4 lg:w-2/3">
         
          <div className="mb-6">
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="mt-1 block w-full p-3 border bg-[#DAD7D3] outline-none border-black rounded-md focus:ring-2 focus:ring-golden50"
              placeholder="Enter your email"
            />
          </div>

          <div className="mb-6">
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="mt-1 block w-full p-3 border bg-[#DAD7D3] outline-none border-black rounded-md focus:ring-2 focus:ring-golden50"
              placeholder="Enter your password"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-golden50 text-black rounded-md font-semibold hover:bg-golden70 transition-all duration-200"
          >
            Login
          </button>
        </div>
      </form>
    </div>
  );
};

export default LoginForm;
