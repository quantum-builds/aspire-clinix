"use client";
import { useState } from "react";

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
    <div className="w-full h-screen flex justify-center items-center bg-[#ACACAC] font-opus text-[#382F26]">
      <form
        onSubmit={handleSubmit}
        className="w-full md:w-1/2 h-full flex flex-col items-center justify-center bg-[#DAD7D3]"
      >
        <div className="w-[100%] md:w-[58%] bg-[#DAD7D3] p-5">
          <h2 className="mb-10 text-center text-[20px] md:text-[32px]">
            Login
          </h2>
          <div className="mb-4">
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 mb-3"
            >
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="mt-1 block w-full p-2 border bg-[#DAD7D3] outline-none border-black rounded-md"
              placeholder="Enter your email"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700 mb-3"
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="mt-1 block w-full p-2 border bg-[#DAD7D3] outline-none border-black  rounded-md"
              placeholder="Enter your password"
            />
          </div>

          <button
            type="submit"
            className="w-full p-2 bg-blue-500 text-white rounded-md mt-7"
          >
            Login
          </button>
        </div>
      </form>
    </div>
  );
};

export default LoginForm;
