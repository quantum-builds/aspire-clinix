"use client";

import { FormEvent, useState } from "react";
import { useSearchParams } from "next/navigation";
import { safeNextPath } from "@/lib/planAccess";

export default function AccessForm() {
  const params = useSearchParams();
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!password || loading) return;

    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/access", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });

      if (res.ok) {
        window.location.replace(safeNextPath(params.get("next")));
        return;
      }

      const data = await res.json().catch(() => null);
      setError(data?.message || "Incorrect password");
    } catch {
      setError("Something went wrong. Please try again.");
    }
    setLoading(false);
  }

  return (
    <main className="relative flex min-h-[117.7vh] items-center justify-center overflow-hidden bg-[#0B0A08] px-4">
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-0 h-[350px] w-[600px] -translate-x-1/2 bg-[radial-gradient(ellipse_at_center,rgba(214,188,160,0.18)_0%,rgba(255,255,255,0)_65%)]"
      />

      <form
        onSubmit={handleSubmit}
        className="relative w-full max-w-[460px] rounded-[28px] border border-[#56493A]/45 bg-[#12100D] px-6 py-10 text-center shadow-[0_30px_60px_-20px_rgba(0,0,0,0.7)] sm:px-10"
      >
        <h1 className="font-[family-name:var(--font-cormorant)] text-[36px] font-normal leading-[40px] tracking-[0.9px] text-[#FAF7F2]">
          Private Access
        </h1>
        <p className="mt-3 font-gillSans text-base leading-7 text-[#A8A196]">
          Enter the access password to continue.
        </p>

        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          autoFocus
          autoComplete="current-password"
          className="mt-8 h-12 w-full rounded-full border border-white/15 bg-white/5 px-6 font-gillSans text-base text-[#FAF7F2] placeholder:text-[#A8A196]/60 focus:border-[#D6BCA0]/60 focus:outline-none"
        />

        {error && (
          <p className="mt-3 font-gillSans text-sm text-red-400">{error}</p>
        )}

        <button
          type="submit"
          disabled={loading || !password}
          className="mt-6 inline-flex h-9 w-full items-center justify-center rounded-full bg-[#A49D92] px-6 py-[10px] font-gillSans text-sm font-medium uppercase tracking-wide text-[#0B0A08] transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60 sm:w-[163.5px]"
        >
          {loading ? "Checking..." : "Continue"}
        </button>
      </form>
    </main>
  );
}
